import './App.css';
import { useState } from 'react';
import { Main } from './components/Main.tsx';

const App = () => {
    const [rc, set_rc] = useState(false);

    return (
        <>
            <Main allow_right_click={rc} />
            <a className="build-number" href={BUILD_LINK} target={'_blank'}>
                Build #{BUILD_NUM}
            </a>
            {import.meta.env.DEV && (
                <button
                    className="build-number"
                    style={{ right: 0, left: 'unset' }}
                    type={'button'}
                    onClick={() => set_rc((x) => !x)}
                >
                    Browser Context Menu {rc ? '✅' : '❌'}
                </button>
            )}
        </>
    );
};

export default App;
