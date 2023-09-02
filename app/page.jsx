import ClientSide from "./clientside"

const axios = require('axios');
const cheerio = require('cheerio');

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
