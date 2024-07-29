import { Helmet } from "react-helmet";


export default function Title({ children }) {
    return (
        <>
            <Helmet>
                <title>{children}</title>
            </Helmet>
        </>
    );
}
