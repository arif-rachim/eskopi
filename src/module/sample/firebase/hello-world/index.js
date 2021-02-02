import {Horizontal, Vertical} from "../../../../components/layout/Layout";
import {useFirestore, useFirestoreDocData} from "reactfire";


export default function HelloWorld() {
    const accountRef = useFirestore().collection('account').doc('arif');
    const {data, status} = useFirestoreDocData(accountRef);
    if (status === 'loading') {
        return <Vertical>
            {'Loading data'}
        </Vertical>
    }
    return <Vertical>
        <Horizontal>
            {'Hello ' + data.name}
        </Horizontal>
    </Vertical>
}