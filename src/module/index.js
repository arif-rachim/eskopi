import {Horizontal, Vertical} from "components/layout/Layout";
//import {useAuth, useUser} from "reactfire";
import Button from "components/button/Button";
import useUser from "components/authentication/useUser";
import useAuth from "components/authentication/useAuth";

export default function Index() {
    const {data: user} = useUser();
    const auth = useAuth();
    return <Vertical height={'100%'} p={5}>
        <Horizontal gap={5} vAlign={'center'}><Horizontal>Hello {user.email}</Horizontal><Button onClick={() => {
            auth.signOut();
        }}>Log Out</Button></Horizontal>
    </Vertical>
}