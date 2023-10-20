export default async function LoginPage({
  params,
}: {
  params: { rid: string };
}) {
  return (
    <main className="flex min-h-screen flex-col items-center bg-white space-y-8">
      <div className="w-full flex flex-col items-center gap-12 p-16 pb-14 font-normal text-white bg-primary rounded-b-3xl">
        <div className="text-center">Sign in</div>
        <div className="text-center text-4xl">Welcome Back!</div>
      </div>

      <div className="flex p-0 px-8 flex-col items-center gap-8 self-stretch">
        <div className="flex flex-col items-start gap-4 self-stretch">
          <div className="p-4 items-start gap-2 self-stretch rounded-2xl border border-white-normal-hover bg-white-lighter">
            <div className="text-white-normal-active">
              Username/Email Address
            </div>
          </div>
          <div className="p-4 items-start gap-2 self-stretch rounded-2xl border border-white-normal-hover bg-white-lighter">
            <div className="text-white-normal-active">Password</div>
          </div>
        </div>
        <button className="p-4 justify-center self-stretch rounded-2xl border-2 border-brown-normal">
          <span className="text-brown-normal text-16 font-normal font-semibold">
            Sign In
          </span>
        </button>
      </div>
    </main>
  );
}
