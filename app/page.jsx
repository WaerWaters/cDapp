import ClientSide from "./clientside"

export default async function Home() {
  const allowedWallets = {
    '285c0b8e91ba323da4ca083c9db837e111dafbf3143ece4d03eba8f4': "toolheads",
    'dac355946b4317530d9ec0cb142c63a4b624610786c2a32137d78e25': "theapesociety",
  }
  const stores = ["jpgStore"]

  return (
    <>
      <ClientSide allowedWallets={allowedWallets} stores={stores}/>
    </>
  )
}
