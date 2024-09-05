import { TaskItemForm } from "@/types";

export function getInitValue() {
  return {
    id: 0,
    title: "",
    staffnum: "",
    filteredKeywords: [],
    positionKeywords: [],
    passCompanys: [],
    userId: "",
    maxCount: 10,
    cityCode: "",
    cityName: "",
    salary: {
      minMoney: "",
      maxMoney: "",
    },
    searchText: "",
    activeCheck: false,
    bossOnlineCheck: false,
    headhunterCheck: false,
    experienceValue: [], // 经验要求
    degreeValue: [], // 学历要求
    salaryValue: "", // 薪资要求
    scaleValue: [], // 公司规模要求
    greetingGroupId: null,
    greetings: [],
  } as TaskItemForm;
}
