// import TaskForm from "../../components/taskForm";
import FormWrap from "./FormWrap";
import Breadcrumb from "@/app/pc/components/Breadcrumbs/Breadcrumb";

type Repo = {
  name: string;
  stargazers_count: number;
};
// export async function generateStaticParams() {
//   // console.log("generateStaticParams", arguments);
//   return [
//     {
//       id: ["1", 1],
//     },
//   ];
// }
// export const getServerSideProps = (async () => {
//   // Fetch data from external API
//   const res = await fetch("https://api.github.com/repos/vercel/next.js");
//   const repo: Repo = await res.json();
//   // Pass data to the page via props
//   return { props: { repo } };
// }) satisfies GetServerSideProps<{ repo: Repo }>;

export default async function Page({ params }: { params: any }) {
  const { id } = params;
  return (
    <>
      <Breadcrumb pageName="Task" />
      <FormWrap id={id} />
    </>
  );
}
