import {useInfiniteQuery} from 'react-query';
import {useEffect} from 'react';
import logo from './images/picasso_logo_horiz-0.png'

const fetchRepositories = async (page = 1) => {
    const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts/?_per_page=30&_page=${page}`
    );
    return response.json();
};

const App = () => {
    const {data, hasNextPage, fetchNextPage} = useInfiniteQuery(
        "PICASSO_TEST_ASSIGNMENT",
        ({pageParam = 1}) => fetchRepositories(pageParam),
        {
            getNextPageParam: (lastPage, allPages) => {
                const maxPages = 10;
                const nextPage = allPages.length + 1;
                return nextPage <= maxPages ? nextPage : undefined;
            },
        }
    );

    useEffect(() => {
        let fetching = false;
        const onScroll = async (event) => {
            const {scrollHeight, scrollTop, clientHeight} =
                event.target.scrollingElement;

            if (!fetching && scrollHeight - scrollTop <= clientHeight * 1.5) {
                fetching = true;
                if (hasNextPage) await fetchNextPage();
                fetching = false;
            }
        };

        document.addEventListener("scroll", onScroll);
        return () => {
            document.removeEventListener("scroll", onScroll);
        };
    }, []);

    return (
        <main>
            <img src={logo} height="50px"/>
            <br/>
            <h1>ТЕСТОВОЕ ЗАДАНИЕ</h1>
            <h4>Христиани Евгений</h4>
            <ul>
                {data.pages.map((page) =>
                    page.map((e) => (
                        <li key={e.id}>
                            <p>
                                <b>{e.id}. {e.title}</b>
                            </p>
                            <p>{e.body}</p>
                        </li>
                    ))
                )}
            </ul>
        </main>
    );
};

export default App;