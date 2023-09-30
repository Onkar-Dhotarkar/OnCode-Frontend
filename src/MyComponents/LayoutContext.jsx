import { Outlet } from 'react-router-dom';
import { DbProvider } from './contexts/DbProvider';
import { LangProvider } from './contexts/LangProvider';
import { CodeProvider } from './contexts/CodeProvider';

const MyContextLayout = () => {

    return (
        <CodeProvider>
            <LangProvider>
                <DbProvider>
                    <Outlet />
                </DbProvider>
            </LangProvider>
        </CodeProvider>
    );
};

export default MyContextLayout;