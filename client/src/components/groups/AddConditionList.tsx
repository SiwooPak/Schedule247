import { FC, useState, ChangeEvent, useCallback, useEffect } from "react";
import styled from "styled-components";
import { DefaultLayout, hideMobileCss, mediaQuery } from "../../GlobalStyle";
import SmallButton from "./SmallButton";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { getGroupsApi, createGroupConditionApi } from "../../lib/api/group";
import { useParams } from "react-router";
import { RootState } from "../../redux/reducers";
import { getGroups } from "../../redux/actions/Group";
import { WorkName } from "../schedulepage/WorkersInfo";
import swal from "sweetalert";

const DescBlock = styled.div`
  display: flex;
  margin-top: 10px;
  margin-left: 10px;
  margin-right: 20px;
  border-bottom: 1px solid rgba(170, 170, 170, 0.21);
  padding: 2px;

  > #conditiontitle {
    display: flex;
    font-size: 14px;
    line-height: 20px;
    justify-content: flex-end;
    align-items: flex-end;
    font-style: bold;
    width: 80px;
  }

  > #conditionvalue {
    margin-left: 40px;
    display: flex;
    font-size: 16px;
    justify-content: flex-start;
    align-items: flex-end;
    font-style: bold;
    width: 200px;
  }

  &.button {
    margin-top: 15px;
    margin-right: 20px;
    justify-content: space-between;
    border-style: none;
  }
`;

const WorkSelect = styled.select`
  width: 208px;
  height: 24px;
  margin-left: 40px;
  padding-left: 10px;
  border: 1px solid #a5a5a5;
  box-shadow: 0.05rem 0.05rem 0.05rem #6969692d;

  background-color: white;

  .inputValue {
    width: 100%;
    height: 100%;
  }
`;

const WorkInput = styled.div`
  width: 208px;
  height: 24px;
  margin-left: 40px;

  border: 1px solid #a5a5a5;
  box-shadow: 0.05rem 0.05rem 0.05rem #6969692d;
  background-color: white;

  > .inputValue {
    width: 90%;
    height: 90%;
    margin-left: 0px;
    padding-left: 15px;
    border: none;
  }
`;

const EditBlock = styled.div`
  width: 310px;
  min-height: 250px;
  margin-left: 5px;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  box-shadow: 3px rgba(0, 0, 0, 0.25);
  border-radius: 0.5rem;
  border: 0.01rem solid rgba(0, 0, 0, 0.15);
  padding-top: 10px;
  padding-bottom: 10px;
`;

interface ConditionAddState {
  conditionName: string;
  conditionDesc: string;
  target: string;
  cycle: string;
  workId: number;
  operation: string;
  value: number;
  workName: string;
}

interface Props {
  groupId: string | undefined;
  handleAddCancle: () => void;
}

const AddConditionList: FC<Props> = ({ groupId, handleAddCancle }) => {
  const groups = useSelector((store: RootState) => store.group.groups);
  const selectGroup = groups.find((item) => item._id === groupId) ?? null;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formState, setFromState] = useState<ConditionAddState>({
    conditionName: "",
    conditionDesc: "",
    target: "all",
    cycle: "monthly",
    workId: 1,
    operation: "<",
    value: 1,
    workName: "",
  });
  const selectWork = selectGroup?.works.find(
    (item) => item.workId === formState.workId
  );

  const changeNumInputHandler = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      const numValue = parseInt(value);

      setFromState((prev) => ({
        ...prev,
        [name]: isNaN(numValue) ? value : numValue,
      }));
    },
    []
  );

  const changeInputHandler = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;

      setFromState((prev) => ({
        ...prev,
        [name]: value,
      }));
    },
    []
  );

  const [isEdit, setIsEdit] = useState(false);
  const handleButton = () => {
    setIsEdit(true);
  };
  const handleCancleButton = () => {
    setIsEdit(false);
  };

  const workNameHandler = (e: ChangeEvent<HTMLSelectElement>) => {
    if (selectGroup === null) return;

    const selectWork = selectGroup.works.find(
      (work) => work.workId === Number(e.target.value)
    );

    if (selectWork === undefined) return;
    const { workName, workId } = selectWork;

    setFromState({ ...formState, workName, workId });
  };

  const createCondition = async () => {
    const { conditionName, conditionDesc, target, cycle, workId, operation, value } =
      formState;
    try {
      await createGroupConditionApi({
        groupId,
        conditionName,
        conditionDesc,
        target,
        cycle,
        workId,
        operation: "<",
        value,
      });
      const response = await getGroupsApi();
      dispatch(getGroups(response.data));
      swal({
        title: "???????????? ????????????",
        icon: "success",
        });
      navigate(`/group/${groupId}/condition`);
      handleAddCancle();
    } catch (err) {
      swal({
        title: "?????? ????????? ????????? ?????????",
        icon: "error",
      });
    }
  };

  useEffect(() => {
    if (selectGroup === null) return;

    setFromState((prev) => ({
      ...prev,
      workName: selectGroup.works[0].workName,
    }));
  }, [selectGroup]);

  return (
    <>
      <EditBlock>
        <DescBlock>
          <div id="conditiontitle">?????????</div>
          <WorkInput>
            <input
              className="inputValue"
              placeholder="???????????? ????????? ?????????"
              name="conditionName"
              onChange={changeInputHandler}
              value={formState.conditionName}
            />
          </WorkInput>
        </DescBlock>
        <DescBlock>
          <div id="conditiontitle">????????????</div>
          <WorkInput>
            <input
              className="inputValue"
              placeholder="??????????????? ????????? ?????????"
              name="conditionDesc"
              onChange={changeInputHandler}
              value={formState.conditionDesc}
            />
          </WorkInput>
        </DescBlock>
        <DescBlock>
          <div id="conditiontitle">??????</div>
          <WorkSelect
            name="target"
            onChange={changeInputHandler}
            value={formState.target}
          >
            <option value="all">????????????</option>
          </WorkSelect>
        </DescBlock>
        <DescBlock>
          <div id="conditiontitle">??????</div>
          <WorkSelect
            name="cycle"
            onChange={changeInputHandler}
            value={formState.cycle}
          >
            <option value="monthly">??????</option>
            <option value="weekly">??????</option>
          </WorkSelect>
        </DescBlock>
        <DescBlock>
          <div id="conditiontitle">????????????</div>
          <WorkSelect
            name="workId"
            onChange={workNameHandler}
            value={formState.workId}
          >
            {selectGroup === null
              ? null
              : selectGroup.works.map((item) => (
                  <option value={item.workId}>{item.workName}</option>
                ))}
          </WorkSelect>
        </DescBlock>
        <DescBlock>
          <div id="conditiontitle">?????? ???</div>
          <WorkInput>
            <input
              className="inputValue"
              placeholder="????????? ????????? ?????????"
              name="value"
              onChange={changeNumInputHandler}
              value={Number(formState.value)}
            />
          </WorkInput>
        </DescBlock>
        <DescBlock>
          <div id="conditiontitle">??????</div>
          <WorkSelect
            name="operation"
            onChange={changeInputHandler}
            value={formState.operation}
          >
            <option> {String("??????")}</option>
          </WorkSelect>
        </DescBlock>
        <DescBlock className="button">
          <SmallButton
            title={"??????"}
            onClick={createCondition}
            color={"#5c5c5c"}
          />
          <SmallButton
            title={"??????"}
            onClick={handleAddCancle}
            color={"#b60000"}
          />
        </DescBlock>
      </EditBlock>
    </>
  );
};

export default AddConditionList;
