import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";

import { Group } from "src/entities/group.entity";
import { AuthRepository } from "src/repositories/auth.repository";
import { GroupRepository } from "src/repositories/group.repository";
import { ScheduleRepository } from "src/repositories/schedule.repository";
import { UserRepository } from "src/repositories/user.repository";

@Injectable()
export class GroupService {
  constructor(
    @Inject(forwardRef(() => ScheduleRepository))
    private readonly scheduleRepository: ScheduleRepository,
    private readonly groupRepository: GroupRepository,
    private readonly authRepository: AuthRepository,
    private readonly userRepository: UserRepository,
  ) {}

  // 신규 그룹 추가
  async createGroup(auth: string, group: Group) {
    // 요청된 그룹데이터를 받아서 그룹도큐먼트에 저장
    try {
      const { _id }: any = await this.authRepository.validateToken(auth);
      // 토큰의 오브젝트아이디정보가 제대로 들어있는가?
      if (!_id) throw new UnauthorizedException("Unauthorized");
      const createdGroup: any = await this.groupRepository.createGroup(group);
      if (createdGroup) {
        // 성공시 user에 그룹 아이디 추가
        const result: any = await this.userRepository.addGroupIdFromGroup(
          _id,
          createdGroup,
        );
        return result;
      }
    } catch (err) {
      throw new InternalServerErrorException("Not Created");
    }
  }

  // 그룹 정보 조회
  async getGroup(auth: string) {
    const { _id }: any = await this.authRepository.validateToken(auth);
    // 토큰의 오브젝트아이디정보가 제대로 들어있는가?
    if (!_id) throw new UnauthorizedException("Unauthorized");

    const { groups }: any = await this.userRepository.getGroup(_id);
    if (!groups.length) return null;
    return groups;
  }

  async updateGroup(auth: string, groupId: string, group: Group) {
    if (!auth.length || !groupId.length || !Object.keys(group).length) {
      throw new BadRequestException("Bad Requst");
    } else {
      // 요청이 제대로 왔다면
      const { _id }: any = await this.authRepository.validateToken(auth);

      // 해당 그룹의 소유자인 유저인가?
      const flag: boolean = await this.userRepository.getUserGroupId(
        _id,
        groupId,
      );
      console.log(flag);
      // 유저가 해당 그룹의 아이디를 가지고 있지 않다면.
      if (!flag) throw new UnauthorizedException("Unauthorized");
      // 있다면 그룹 데이터 업데이트
      else await this.groupRepository.updateGroup(groupId, group);
    }
  }

  // 그룹 삭제
  async removeGroup(auth: string, groupId: string) {
    // 요청 정보 확인
    if (!auth.length || !groupId.length) {
      throw new BadRequestException("Bad Requst");
    } else {
      // 토큰 정보 복호화
      const { _id }: any = await this.authRepository.validateToken(auth);
      // 해당 유저가 갖고 있는 유저의 해당 그룹 아이디 정보 삭제
      await this.userRepository.removeGroupFromUser(_id, groupId);
      // 해당 그룹이 갖고 있는 스케쥴을 삭제하기 위해 그룹 도큐먼트에서 스켸쥴 아이디만 조회
      const { schedules }: any =
        await this.groupRepository.getScheduleIdFromGroup(groupId);
      // 해당 스케쥴 삭제
      schedules.forEach(async (scheduleId) => {
        await this.scheduleRepository.removeSchedule(scheduleId);
      });
      // 해당 그룹 삭제
      await this.groupRepository.removeGroup(groupId);
    }
  }
}
