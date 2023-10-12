export interface ScheduleListDetail {
  show: string;
  setlist: string;
  member: string[];
  seitansai: string[];
}

export interface ScheduleList {
  date: string;
  event: {
    title: string;
    category: string;
  }[];
}

export interface ScheduleData {
  period: string;
  listSchedule: ScheduleList[];
}

export interface MemberData {
  id: string;
  image: string;
  name: string | null;
  memberStatus: string;
}

export interface DetailMember {
  image: string;
  fullName: string;
  birthday: string;
  bloodType: string;
  zodiac: string;
  height: string;
  nickname: string;
}

export interface NewsDataList {
  title: string;
  time: string;
}
