import {
  LessonListItem,
  type LessonListItemProps,
} from "@/components/LessonListItem";

// type ListElementProps = {
//   firstName: string;
//   lastName: string;
//   age: number;
// };

export default async function Dashboard() {
  const lessons = [
    {
      subject: "Matematyka",
      duration: 90,
      date: new Date(2024, 11, 10).getTime(),
    },
    {
      subject: "Matematyka",
      duration: 60,
    },
    {
      subject: "Fizyka",
      duration: 60,
    },
    {
      subject: "Angielski",
      duration: 60,
      date: new Date(2024, 9, 8).getTime(),
    },
    {
      subject: "math",
      duration: 60,
    },
    {
      subject: "math",
      duration: 60,
    },
    {
      subject: "Matematyka",
      duration: 90,
      date: new Date(2024, 11, 10).getTime(),
    },
    {
      subject: "Matematyka",
      duration: 60,
    },
    {
      subject: "Fizyka",
      duration: 60,
    },
    {
      subject: "Angielski",
      duration: 60,
      date: new Date(2024, 9, 8).getTime(),
    },
    {
      subject: "math",
      duration: 60,
    },
    {
      subject: "math",
      duration: 60,
    },
  ] satisfies LessonListItemProps[];

  return (
    <main>
      <div>Hello there</div>

      <ul className="flex flex-col items-center justify-center gap-8">
        {lessons.map((lesson, index) => (
          <LessonListItem key={index} {...lesson} />
        ))}
      </ul>

      <ul></ul>
    </main>
  );
}

// export function ListElement({ firstName, lastName, age }: ListElementProps) {
//   return (
//     <li>
//       <div>
//         {firstName}
//         {lastName}
//         {age}
//       </div>
//     </li>
//   );
// }
