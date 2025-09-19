import './App.css';
import { Main } from './components/main.tsx';

const App = () => {
    return (
        <>
            <Main />
            <a className="build-number" href={BUILD_LINK} target={'_blank'}>
                Build #{BUILD_NUM}
            </a>
        </>
    );
};

export default App;
