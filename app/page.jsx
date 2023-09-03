import ClientSide from "./clientside"

export default async function Home() {
  const allowedWallets = {
    '285c0b8e91ba323da4ca083c9db837e111dafbf3143ece4d03eba8f4': "toolheads",
  }

  return (
    <>
      <ClientSide allowedWallets={allowedWallets}/>
    </>
  )
}
