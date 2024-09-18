import { PreviewButton } from "@/components/preview-components";

export default async function Home() {
  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-12 p-5">
      <section className="flex flex-col gap-4">
        <h1>Welcome to the page!</h1>
        <div>
          <PreviewButton />
        </div>
      </section>
      <section>
        <h2>Here is the main page</h2>

        <div>
          <p>this section shows h2 header with a paragraph</p>
          <p>This is purely to showcase shadcn/ui components</p>
        </div>
      </section>
    </main>
  );
}
