import { FC } from "react";
import styled from "styled-components";
import MultiColumnSelectBox from "../MultiColumnSelectBox";

const Block = styled.div`
  padding: 13px;
  box-sizing: border-box;
  background: #ffffff;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 15px;
  position: relative;
  width: 300px;

  .groupName {
    width: 229px;
    height: 50px;
  }
`;

const selectBoxOptions: SelectOption[] = [
  {
    text: "๐",
    value: "๐",
  },
  {
    text: "๐",
    value: "๐",
  },
  {
    text: "๐ฅฐ",
    value: "๐ฅฐ",
  },
  {
    text: "๐",
    value: "๐",
  },
  {
    text: "๐ท",
    value: "๐ท",
  },
  {
    text: "๐",
    value: "๐",
  },
  {
    text: "๐งก",
    value: "๐งก",
  },
  {
    text: "๐",
    value: "๐",
  },
  {
    text: "๐",
    value: "๐",
  },
  {
    text: "๐ค",
    value: "๐ค",
  },
  {
    text: "๐ฆ",
    value: "๐ฆ",
  },
  {
    text: "๐ฏ",
    value: "๐ฏ",
  },
  {
    text: "๐ช",
    value: "๐ช",
  },
  {
    text: "๐ฌ",
    value: "๐ฌ",
  },
  {
    text: "๐",
    value: "๐",
  },
  {
    text: "๐ญ",
    value: "๐ญ",
  },
  {
    text: "๐",
    value: "๐",
  },
  {
    text: "๐น",
    value: "๐น",
  },
  {
    text: "๐ง",
    value: "๐ง",
  },
  {
    text: "๐ฅ",
    value: "๐ฅ",
  },
  {
    text: "๐ญ",
    value: "๐ญ",
  },
  {
    text: "๐ก",
    value: "๐ก",
  },
  {
    text: "๐ฅ",
    value: "๐ฅ",
  },
  {
    text: "๐ฅจ",
    value: "๐ฅจ",
  },
  {
    text: "๐ญ",
    value: "๐ญ",
  },
  {
    text: "๐",
    value: "๐",
  },
  {
    text: "๐",
    value: "๐",
  },
  {
    text: "๐",
    value: "๐",
  },
  {
    text: "๐",
    value: "๐",
  },
  {
    text: "๐ง",
    value: "๐ง",
  },
  {
    text: "๐ฐ",
    value: "๐ฐ",
  },
  {
    text: "๐ค",
    value: "๐ค",
  },
  {
    text: "๐ซ",
    value: "๐ซ",
  },
  {
    text: "๐",
    value: "๐",
  },
  {
    text: "๐",
    value: "๐",
  },
  {
    text: "๐ธ",
    value: "๐ธ",
  },
  {
    text: "๐",
    value: "๐",
  },
  {
    text: "๐ฅ",
    value: "๐ฅ",
  },
  {
    text: "๐ฅ",
    value: "๐ฅ",
  },
  {
    text: "๐ฅ",
    value: "๐ฅ",
  },
];

const GroupBasicInfo: FC = () => {
  return (
    <>
      <h4>๊ทธ๋ฃน ๊ธฐ๋ณธ์?๋ณด</h4>
      <Block>
        <div>
          <MultiColumnSelectBox options={selectBoxOptions} />
          <input className="groupName" placeholder="๊ทธ๋ฃน๋ช" />
          <input className="groupDesc" placeholder="๊ทธ๋ฃน์ค๋ช" />
        </div>
      </Block>
    </>
  );
};

export default GroupBasicInfo;
