import "./LessonListItem.css";

export type LessonListItemProps = {
  subject: string;
  duration: number;
  date?: number;
};

export function LessonListItem({
  subject,
  duration,
  date,
}: LessonListItemProps) {
  const finished = Boolean(date);

  return (
    <li className={`lesson_list_item ${finished && "finished"}`}>
      <div className="subject">{subject}</div>
      <div className="duration">{duration}</div>
      <div className="date">{new Intl.DateTimeFormat("pl").format(date)}</div>
    </li>
  );
}
