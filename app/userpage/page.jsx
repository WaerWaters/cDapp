'use client'

import Nav from "../components/nav"

export default function UserPage() {

    const api = window.cardano

    return (
        <>
            <Nav api={api} />
        </>
    )
}