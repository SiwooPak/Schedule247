import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { BoxHeader, BoxSection, ErrMsg } from "../../style/theme";
import DatePicker from "react-datepicker";
import "./react-datepicker.css";
import { ko } from "date-fns/esm/locale";
import { ScheduleDummy, selectBoxOptions } from "./ScheduleDummy";
import axios from "axios";
import EmojiBox from "./EmojiBox";
import { useEffect } from "react";
import { useCallback } from "react";
import { RootState } from "../../redux/reducers";
import { getGroupsApi } from "../../lib/api/group";
import { getGroups } from "../../redux/actions/Group";
import { useNavigate } from "react-router";
import { mediaQuery } from "../../GlobalStyle";
import swal from "sweetalert";

export const AddScheduleWrapper = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 1rem;
`;

export const AddDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f9f9f9;
  width: 450px;
  height: 450px;
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 0.5rem;
  border: 1px solid #cacacac0;
  box-shadow: 1px 1px 1px #cacaca57;
  ${mediaQuery.mobile} {
    max-width: 290px;
    padding: 15px;
    border-radius: 5px;
  }
`;

export const DivWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0.5rem;
  /* align-items: center; */
`;

export const TitleHeader = styled.div`
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

export const Title = styled.div`
  font-size: 18px;
  font-weight: bold;
  &.sub {
    padding-left: 3px;
  }
  &.padding {
    padding-left: 20px;
  }
`;

export const NameBox = styled.input`
  width: 230px;
  height: 40px;
  padding-left: 10px;
  border: 1px solid #a5a5a5;
  box-shadow: 0.05rem 0.05rem 0.05rem #6969692d;
  margin: 0.2rem;
  background-color: white;
  ${mediaQuery.mobile} {
    max-width: 190px;
  }
`;

export const TeamSelect = styled.select`
  width: 300px;
  height: 45px;
  padding-left: 10px;
  border: 1px solid #a5a5a5;
  box-shadow: 0.05rem 0.05rem 0.05rem #6969692d;
  margin: 0.2rem;
  background-color: white;
  ${mediaQuery.mobile} {
    max-width: 260px;
  }
`;

export const AddBtn = styled.button`
  width: 300px;
  height: 40px;
  color: white;
  box-shadow: 0.05rem 0.05rem 0.05rem #696969;
  border: 0px solid #a5a5a5;
  cursor: pointer;
  margin: 0.5rem;
  background-color: #5c5c5c;
  ${mediaQuery.mobile} {
    max-width: 260px;
  }
`;

export const Div1 = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Div2 = styled.div`
  width: 288px;
  height: 29px;
  padding-top: 13px;
  padding-left: 10px;
  border: 1px solid #a5a5a5;
  box-shadow: 0.05rem 0.05rem 0.05rem #6969692d;
  margin: 0.2rem;
  background-color: white;
  font-size: 13px;

  &.sub {
    width: 240px;
  }

  ${mediaQuery.mobile} {
    max-width: 260px;
  }
`;

export default function AddSchedule() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //??????????????? ??????
  const [startDate, setStartDate] = useState<any>(new Date());

  //????????? ?????? ?????? ??????
  const [scheduleInfo, setScheduleInfo] = useState({
    groupId: "",
    scheduleName: "",
    period: "",
  });

  //????????? ??????
  const [scheduleEmoji, setScheduleEmoji] = useState(
    ScheduleDummy[0].scheduleEmoji
  );

  //??????????????? ??????
  const [errMessage, setErrMessage] = useState<string>("");

  //??????????????????
  const groups = useSelector((store: RootState) => store.group.groups);

  //????????? ?????? ??????
  const handleNewSchedule = (): void => {
    axios
      .post(
        `https://server.schedule24-7.link/schedule/${scheduleInfo.groupId}`,
        {
          scheduleName: scheduleInfo.scheduleName,
          scheduleEmoji: scheduleEmoji,
          period: scheduleInfo.period,
        },
        {
          headers: {
            authorization: `Bearer ${window.localStorage.getItem("token")}`,
          },
        }
      )
      .then(() => {
        getGroupsApi().then((res) => {
          dispatch(getGroups(res.data));
        });
        navigate(-1);
      })
      .catch((res) => {
        console.log(res.message);
        if (scheduleEmoji === "") {
          setErrMessage("???????????? ??????????????????");
        } else if (scheduleInfo.scheduleName === "") {
          setErrMessage("????????? ????????? ??????????????????");
        } else if (scheduleInfo.groupId === "") {
          setErrMessage("????????? ??????????????????");
        } else if (res.message === "Request failed with status code 400") {
          swal({ title: "?????????????????? ???????????????", icon: "error" });
        }
      });
  };

  //?????? ????????? ?????? ?????? ??????
  const handleSelectInfo =
    (key: string) => (e: React.ChangeEvent<HTMLSelectElement>) => {
      setScheduleInfo({ ...scheduleInfo, [key]: e.target.value });
    };

  const handleTextInfo =
    (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setScheduleInfo({ ...scheduleInfo, [key]: e.target.value });
    };

  const handleEmoji = useCallback(
    (emoji: string): void => {
      setScheduleEmoji(emoji);
    },
    [scheduleEmoji]
  );

  useEffect(() => {
    let newDate = new Date(startDate);
    let result = `${newDate.getFullYear()}-${newDate.getMonth() + 1}-01`;
    setScheduleInfo({ ...scheduleInfo, period: result });
  }, [startDate]);

  return (
    <BoxSection>
      <BoxHeader>
        <span>?????? ????????? ??????</span>
      </BoxHeader>
      <AddScheduleWrapper>
        <AddDiv>
          <DivWrapper>
            <TitleHeader>?????? ????????? ?????? ??????</TitleHeader>
          </DivWrapper>
          <DivWrapper>
            <Title>????????????</Title>
            <Div1>
              <EmojiBox options={selectBoxOptions} handleEmoji={handleEmoji} />
              <NameBox
                type="text"
                onChange={handleTextInfo("scheduleName")}
                placeholder="????????? ?????? ??????"
              />
            </Div1>
          </DivWrapper>
          <DivWrapper>
            <Title className="sub">????????????</Title>
            <TeamSelect onChange={handleSelectInfo("groupId")}>
              <option>?????????</option>
              {groups.map((el, idx) => {
                return (
                  <option key={idx} value={el._id}>
                    {el.groupName}
                  </option>
                );
              })}
            </TeamSelect>
          </DivWrapper>
          <DivWrapper>
            <Title>????????????</Title>
            <Div1>
              <DatePicker
                locale={ko}
                selected={startDate}
                dateFormat="MM/yyyy"
                onChange={(date: any) => {
                  setStartDate(date);
                }}
                showMonthYearPicker
                showFullMonthYearPicker
              />
            </Div1>
          </DivWrapper>
          <AddBtn onClick={handleNewSchedule}>????????? ??????</AddBtn>
          <ErrMsg className="centered">{errMessage}</ErrMsg>
        </AddDiv>
      </AddScheduleWrapper>
    </BoxSection>
  );
}
