import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { useNavigate } from "react-router";
import styled from "styled-components";
import { getGroupsApi } from "../../lib/api/group";
import { getGroups } from "../../redux/actions/Group";
import { RootState } from "../../redux/reducers";
import { BoxHeader, BoxSection } from "../../style/theme";
import Layout from "../Layout";
import { ScheduleDummy } from "./ScheduleDummy";

export const EditScheduleWrapper = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 1rem;
`;

export const ListDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f9f9f9;
  width: 450px;
  height: 350px;
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 0.5rem;
  border: 1px solid #cacacac0;
  box-shadow: 1px 1px 1px #cacaca57;
`;

export const TitleHeader = styled.div`
  font-size: 22px;
  font-weight: bold;
  margin: 0.5rem;
`;

export const Wrapper = styled.div`
  display: flex;
`;

export const WorkNameWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export const WorkName = styled.div`
  display: flex;
  width: 40px;
  height: 31px;
  padding-top: 13px;
  /* padding-left: 10px; */
  /* border: 1px solid #a5a5a5; */
  box-shadow: 0.05rem 0.05rem 0.05rem #6969692d;
  margin: 0.2rem;
  background-color: #595959;
  color: white;
  justify-content: center;
`;

export const WorkerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  /* width: 500px; */
`;

export const Worker = styled.div`
  display: flex;
  width: 400px;
  height: 42px;
  /* padding-top: 13px; */
  /* padding-left: 10px; */
  border: 1px solid #b4b4b4;
  box-shadow: 0.05rem 0.05rem 0.05rem #6969692d;
  margin: 0.2rem;
  background-color: white;
  justify-content: center;
  font-size: 14px;
`;

export const WorkerNameWrapper = styled.div`
  display: flex;
  padding-left: 7px;
  :hover {
    background-color: #ecf6ff;
  }
`;

export const WorkerName = styled.div`
  margin-left: 5px;
  margin-right: 5px;
  margin-top: 13px;
  margin-bottom: 13px;
`;

export const EditBtn = styled.button`
  width: 239px;
  height: 30px;
  color: white;
  box-shadow: 0.05rem 0.05rem 0.05rem #696969;
  border: 0px solid #a5a5a5;
  cursor: pointer;
  margin: 0.3rem;
  background-color: #808080;

  &.confirm {
    width: 45px;
    background-color: #5c5c5c;
  }
`;

export const DeleteBtn = styled.button`
  /* display: none; */
  border: none;
  background-color: transparent !important;
  background-image: none !important;
  margin-left: 0px;
  margin-right: 5px;
  margin-top: 13px;
  margin-bottom: 13px;
  color: white;
  cursor: pointer;
  :hover {
    background-color: #f0f0f0;
    color: #464646;
  }
`;

export const SelectBoxWrapper = styled.div`
  display: flex;
  /* justify-content: center; */
  align-items: center;
  padding-left: 4px;
  select {
    border: 1px solid #b4b4b4;
    margin: 2px;
    height: 30px;
  }
`;

export const EditList = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  display: flex;
  > div {
    margin: 5px;
  }
`;

export const EditMemberList = styled.div`
  /* border: 1px solid black; */
  font-size: 14px;
`;

export default function WorkersInfo() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();

  //스토어에서 데이터 불러오기
  const groups = useSelector((store: RootState) => store.group.groups);

  //현재 그룹 필터링
  const currentGroup: any = groups.filter((el: any) => {
    return el._id === params.groupId;
  });

  //각종아이디 모음
  const groupId = params.groupId;
  const scheduleId = params.scheduleId;
  const contentId = params.contentId;

  //그룹에 존재하는 모든 멤버 불러오는 함수
  let members = groups.filter((el: any) => {
    return el._id === groupId;
  });

  //화면렌더링시 업데이트
  useEffect(() => {
    getGroupsApi().then((res) => {
      dispatch(getGroups(res.data));
    });
  }, [dispatch, navigate, params]);

  //현재 스케쥴만 필터링
  let currentSchedule: any;
  if (currentGroup.length !== 0) {
    currentSchedule = currentGroup[0].schedules.filter((el: any) => {
      return el._id === params.scheduleId;
    });
  } else {
    currentSchedule = ScheduleDummy;
  }

  //수정버튼 눌렀을 때 상태관리
  const [openEditBox, setOpenEditBox] = useState(false);

  //추가할 멤버 상태관리
  const [editWorker, setEditWorker] = useState<any[]>([]);
  const [editWorkerList, setEditWorkerList] = useState<any[]>([]);

  //멤버를 추가할 근무상태관리
  const [currentWork, setCurrentWork] = useState<any>(undefined);

  //원래 근무자들 명단
  const workerArr = currentSchedule[0].contents[Number(params.contentId) - 1];
  let workers: any[];
  if (workerArr) {
    workers = workerArr.team;
  } else {
    workers = [{ team: undefined }];
  }

  //수정버튼 눌렀을 때 수정창 활성화 함수
  const handleWorkerEdit = () => {
    if (openEditBox) {
      setOpenEditBox(false);
    } else {
      setOpenEditBox(true);
    }
  };

  //추가할 명단 생성 함수
  const handleEditWorkerList = (e: React.ChangeEvent<HTMLSelectElement>) => {
    let tmp = [...editWorker];
    tmp.push(e.target.value);
    setEditWorker(tmp);
  };

  interface tmpobj {
    memberId: number | string;
    memberName: string;
  }

  //근무자 선택하는 함수
  const handleWorkerSelect = () => {
    let filteredEditWorker = editWorker.filter((el: string) => {
      return el !== "추가할근무자";
    });

    if (
      currentWork &&
      filteredEditWorker.length !== 0 &&
      currentWork !== "근무유형선택"
    ) {
      for (let i = 0; i < filteredEditWorker.length; i++) {
        let tmpIdx = members[0].members[filteredEditWorker[i]].memberId;
        let tmpMemberName =
          members[0].members[filteredEditWorker[i]].memberName;
        let tmpObj: tmpobj = { memberId: "", memberName: "" };
        tmpObj.memberId = tmpIdx;
        tmpObj.memberName = tmpMemberName;

        let checkIdExist: boolean = false;
        editWorkerList.forEach((el: any) => {
          if (el.memberId === tmpObj.memberId) {
            checkIdExist = true;
          }
        });

        if (!checkIdExist) {
          setEditWorkerList([...editWorkerList, tmpObj]);
        }
      }
    } else {
      alert("근무유형 또는 근무자가 선택되었는지 확인해주세요");
    }
  };

  //근무자를 추가할 근무형태 선택함수
  const handleInputWork = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value !== undefined) {
      setCurrentWork(e.target.value);
    }
  };

  //멤버삭제함수
  const handleMemberDelete = (workidx: any, memberId: any) => {
    let tmp = workers[workidx];
    let deleteMember = tmp.members.filter((el: any) => {
      return el.memberId === memberId;
    });

    let result = tmp.members.filter((el: any) => {
      return el.memberId !== deleteMember[0].memberId;
    });

    let final = workers;
    final[workidx].members = result;

    axios
      .patch(
        `https://server.schedule24-7.link/schedule/${groupId}/${scheduleId}/${contentId}`,
        { team: [final[workidx]] },
        {
          headers: {
            authorization: `Bearer ${window.localStorage.getItem("token")}`,
          },
        }
      )
      .then(() => {
        navigate(`/schedule/editworker/${groupId}/${scheduleId}/${contentId}`);
        alert("수정완료");
      });
  };

  //멤버명단추가함수
  const handleScheduleEdit = (): void => {
    if (currentWork && editWorkerList.length !== 0) {
      let tmp = workers[currentWork].members;
      editWorkerList.forEach((el: any) => {
        let test = false;

        for (let item of tmp) {
          console.log(item);
          console.log(el);
          if (item.memberId === el.memberId) {
            test = true;
          }
        }

        if (!test) {
          tmp.push(el);
          test = false;

          let final = workers;
          final[currentWork].members = tmp;

          axios
            .patch(
              `https://server.schedule24-7.link/schedule/${groupId}/${scheduleId}/${contentId}`,
              { team: [final[currentWork]] },
              {
                headers: {
                  authorization: `Bearer ${window.localStorage.getItem(
                    "token"
                  )}`,
                },
              }
            )
            .then(() => {
              navigate(
                `/schedule/editworker/${groupId}/${scheduleId}/${contentId}`
              );
              getGroupsApi().then((res) => {
                dispatch(getGroups(res.data));
              });
              setEditWorkerList([]);
              alert("수정완료");
            });
        } else {
          setEditWorkerList([]);
          alert("이미 존재하는 근무자입니다");
        }
      });
    }
  };

  //현재 날짜 상단 표시할 함수
  let currentDate: string[];
  if (
    (currentDate = currentSchedule[0].contents[Number(params.contentId) - 1])
  ) {
    currentDate = currentSchedule[0].contents[Number(params.contentId) - 1].date
      .split(",")[0]
      .split("/");
  } else {
    currentDate = ["데이터를 불러오는 중입니다"];
  }

  let viewDate: string;
  if (currentDate.length > 1) {
    viewDate = `${currentDate[2]}년 ${currentDate[0]}월 ${currentDate[1]}일`;
  } else {
    viewDate = currentDate[0];
  }

  return (
    <Layout title="스케쥴">
      <BoxSection>
        <BoxHeader>
          <span>스케쥴명단수정</span>
        </BoxHeader>
        <EditScheduleWrapper>
          <ListDiv>
            <Wrapper>
              <TitleHeader>{viewDate}</TitleHeader>
              <TitleHeader>근무자명단</TitleHeader>
            </Wrapper>
            <Wrapper>
              <WorkNameWrapper>
                {workers[0].work !== undefined
                  ? workers.map((el: any) => {
                      return <WorkName>{el.work.workName}</WorkName>;
                    })
                  : "데이터를 불러오는 중입니다"}
              </WorkNameWrapper>
              <WorkerWrapper>
                {workers[0].work !== undefined
                  ? workers.map((el: any, testIdx) => {
                      return (
                        <Worker>
                          {el.members.map((item: any) => {
                            return (
                              <WorkerNameWrapper>
                                <WorkerName>{item.memberName}</WorkerName>
                                <DeleteBtn
                                  value={item.memberId}
                                  onClick={() =>
                                    handleMemberDelete(testIdx, item.memberId)
                                  }
                                >
                                  X
                                </DeleteBtn>
                              </WorkerNameWrapper>
                            );
                          })}
                        </Worker>
                      );
                    })
                  : "데이터를 불러오는 중입니다"}
              </WorkerWrapper>
            </Wrapper>
            <EditBtn onClick={handleWorkerEdit}>수정</EditBtn>
            {openEditBox ? (
              <>
                <SelectBoxWrapper>
                  <select onChange={handleInputWork}>
                    <option value={undefined}>근무유형선택</option>
                    {workers.map((el: any, idx) => {
                      return (
                        <option key={idx} value={idx}>
                          {el.work.workName}
                        </option>
                      );
                    })}
                  </select>
                  <select onChange={handleEditWorkerList}>
                    <option value={undefined}>추가할근무자</option>
                    {members[0].members.map((el: any, idx) => {
                      return (
                        <option key={idx} value={el.memberId}>
                          {el.memberName}
                        </option>
                      );
                    })}
                  </select>
                  <EditBtn className="confirm" onClick={handleWorkerSelect}>
                    선택
                  </EditBtn>
                </SelectBoxWrapper>
                <EditList>
                  <div>추가할명단</div>
                  {editWorkerList.length !== 0
                    ? editWorkerList.map((el: any) => {
                        return <EditMemberList>{el.memberName}</EditMemberList>;
                      })
                    : ""}
                  <EditBtn className="confirm" onClick={handleScheduleEdit}>
                    확인
                  </EditBtn>
                </EditList>
              </>
            ) : (
              ""
            )}
            <EditBtn onClick={() => navigate(-1)}>뒤로</EditBtn>
          </ListDiv>
        </EditScheduleWrapper>
      </BoxSection>
    </Layout>
  );
}