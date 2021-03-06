import { useState } from "react";
import styled from "styled-components";
import Calendar from "./CalendarGenerator";
import { dayArr, ScheduleDummy } from "./ScheduleDummy";
import ScheduleItem from "./ScheduleItem";
import TableHeader from "./TableHeader";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/reducers";
import ScheduleItemColumn from "./ScheduleItemColumn";
import moment from "moment";
import { useNavigate, useParams } from "react-router";
import { getGroupsApi } from "../../lib/api/group";
import { getGroups } from "../../redux/actions/Group";
import { Link } from "react-router-dom";
import { mediaQuery } from "../../GlobalStyle";

export const ViewScheduleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const TableTopWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  ${mediaQuery.mobile} {
    margin-bottom: 8px;
  }
`;

export const DateWrapper = styled.div`
  width: 80vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const SelectBox = styled.select`
  border-radius: 0.4rem;
  width: 135px;
  height: 30px;
  color: #3b3b3b;
  border: 0.1px solid #858585;
  cursor: grab;
  /* margin-left: 26px; */
  ${mediaQuery.mobile} {
    margin-left: 0px;
  }
`;

export const TableTitle = styled.div`
  font-size: 20px;
  font-weight: bold;
  margin: 5px;
  text-align: cneter;
  a {
    color: black;
    text-decoration: none;
  }
  a:visited {
    color: black;
    text-decoration: none;
  }

  ${mediaQuery.mobile} {
    font-size: 17px;
    margin: 3px;
  }
`;

export const SubTextWrapper = styled.div`
  display: flex;
  justify-content: ceneter;
`;

export const SubText = styled.div`
  margin-left: 5px;
  margin-right: 5px;
  text-align: cneter;
  ${mediaQuery.mobile} {
    font-size: 14px;
  }
`;

export const ViewSelect = styled.div`
  width: 135px;
  display: flex;
  justify-content: right;
  ${mediaQuery.mobile} {
    justify-content: right;
  }
`;

export const ScheduleTable = styled.div`
  display: grid;
  height: 80vh;
  justify-content: center;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  grid-template-rows: 0.2fr 1fr 1fr 1fr 1fr 1fr 1fr;
  ${mediaQuery.mobile} {
    margin: 0;
  }
`;

export const ScheduleColumnTable = styled.div`
  display: flex;
  flex-direction: column;
`;

export const SelectBtn = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 28px;
  height: 28px;
  background-color: #797979;
  /* box-shadow: 0 0 1px #d4d4d4; */
  border: 1px solid #797979;
  border-radius: 3px;
  margin-left: 2px;
  cursor: pointer;
  &.list {
    /* margin-left: 1px; */
  }
`;

export const TableIcon = styled.img`
  width: 14px;

  &.list {
    height: 17px;
  }
`;

export default function ViewSchedule() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();

  //?????????????????? ????????? ??????
  const groups = useSelector((store: RootState) => store.group.groups);

  //?????? ?????? ?????????
  const currentGroup: any = groups.filter((el: any) => {
    return el._id === params.groupId;
  });

  //?????? ???????????? ?????????
  let currentSchedule: any;
  if (currentGroup.length !== 0) {
    currentSchedule = currentGroup[0].schedules.filter((el: any) => {
      return el._id === params.scheduleId;
    });
  } else {
    currentSchedule = ScheduleDummy;
  }

  //????????? ??? ????????? ?????? ??????????????? ??????
  useEffect(() => {
    getGroupsApi().then((res) => {
      dispatch(getGroups(res.data));
    });
    handleFirstRender(currentSchedule[0].period);
  }, [dispatch, params]);

  useEffect(() => {
    handleFirstRender(currentSchedule[0].period);
  }, [groups]);

  //?????? ??????
  const [currentDate, setCurrentDate] = useState(moment().format("YYYY-MM-DD"));

  //???????????? ?????? ??????
  const [viewMode, setViewMode] = useState(true);

  //?????????????????? ??????
  const handleViewChange = (value: boolean): void => {
    setViewMode(value);
  };

  //???????????? ????????? ????????? ???????????? ??????
  let newArr: string[] = Calendar(currentDate);
  const handleCurrentDate = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    if (e.target.value !== "????????? ??????") {
      let url = e.target.value.split(",");
      navigate(`/schedule/view/${url[0]}/${url[1]}`);
    }
  };

  //?????????????????? ????????? ????????? ??????
  const handleFirstRender = (date: string): void => {
    setCurrentDate(date);
    newArr = Calendar(date);
  };
  
  const handleSharePage = () => {
    // navigate(`/schedule/view/share/${params.scheduleId}`)
    window.location.replace(`/schedule/view/share/${params.scheduleId}`)
  }

  //????????? ????????? ????????? ??????
  let columnArr = newArr.filter((el: any) => {
    let tmp: string;
    if (Number(currentDate.split("-")[1]) < 10) {
      tmp = `0${currentDate.split("-")[1]}`;
    } else {
      tmp = currentDate.split("-")[1];
    }
    return el.split("-")[1] === tmp;
  });

  //????????? ?????? ??? ?????????
  let tableName: string = currentSchedule[0].scheduleName;
  let tableTeam: string = currentSchedule[0].group.groupName;

  return (
    <ViewScheduleWrapper>
      <TableTopWrapper>
        <SelectBox onChange={handleCurrentDate}>
          <option>????????? ??????</option>
          {groups.map((el: any, idx: any) => {
            return el.schedules.map((item: any, idx: any) => {
              return (
                <option key={idx} value={[el._id, item._id]}>
                  {item.scheduleName}
                </option>
              );
            });
          })}
        </SelectBox>
        <DateWrapper>
          <TableTitle>
            <Link to={`/schedule/info/${params.groupId}/${params.scheduleId}`}>
              {tableName}
            </Link>
          </TableTitle>
          <SubTextWrapper>
            <SubText>
              {currentDate.split("-")[0]}??? {currentDate.split("-")[1]}???
            </SubText>
            <SubText>{tableTeam}</SubText>
          </SubTextWrapper>
        </DateWrapper>
        <ViewSelect>
          <SelectBtn onClick={()=>handleSharePage()}>
            <TableIcon src="https://cdn.discordapp.com/attachments/876977982760165416/920911715028308009/pngaaa.com-1385850.png" />
          </SelectBtn>
          <SelectBtn className="list" onClick={() => handleViewChange(true)}>
            <TableIcon
              className="list"
              src="https://media.discordapp.net/attachments/907157959333785630/920132429044387890/listwhite.png"
            />
          </SelectBtn>
          <SelectBtn onClick={() => handleViewChange(false)}>
            <TableIcon src="https://media.discordapp.net/attachments/907157959333785630/920129010980225034/gridwhite.png" />
          </SelectBtn>
        </ViewSelect>
      </TableTopWrapper>
      {viewMode ? (
        <ScheduleColumnTable>
          {columnArr.map((el, idx) => {
            return (
              <ScheduleItemColumn
                key={idx}
                DayNum={el}
                NewDummy={currentSchedule[0]}
              />
            );
          })}
        </ScheduleColumnTable>
      ) : (
        <ScheduleTable>
          {dayArr.map((el, idx) => {
            return <TableHeader key={idx} DayHeader={el} />;
          })}
          {newArr.map((el, idx) => {
            return (
              <ScheduleItem
                key={idx}
                DayNum={el}
                NewDummy={currentSchedule[0]}
              />
            );
          })}
        </ScheduleTable>
      )}
    </ViewScheduleWrapper>
  );
}
