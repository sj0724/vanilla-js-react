import { createElement } from '../dom/client';
import { pathToRegex } from './utils';

export type Component = (props?: Record<string, any>) => any;

export type Route = {
  path: string;
  element?: Component;
  errorElement?: Component;
  children?: Route[];
};

const spaRouter = () => {
  let pageParams: any;
  const routeInfo: { root: HTMLElement | null; routes: Route[] | null } = {
    root: null,
    routes: null,
  };

  const matchUrlToRoute = (routes: Route[], path: string) => {
    //1. "/category/apple" => ['/', 'category', 'apple']` 이런 형태의 segements를 얻는다.
    const segments = path.split('/').map((segment) => {
      if (segment === '') return '/';
      return segment;
    });

    if (segments.length <= 2 && segments[1] === '/') {
      return { Component: routes[0].element, params: undefined }; // @/routes/index.ts에 있는 기본 route element 요소 리턴(main페이지)
    }
    //2. children이 없고 segments가 하나만 남았을때까지 재귀적으로 도는 함수
    function traverse(
      routes: Route[],
      segments: string[],
      errorComponent?: Component
    ) {
      //3. routes를 순회함
      for (const route of routes) {
        const { path, children, element, errorElement } = route;
        //4. pathToRegex함수를통해 path를 정규식 형태로 만들어준다.
        const regex = pathToRegex(path);
        //5. segments의 첫 번째 index가 regex랑 매칭이 되는지 확인합니다.
        const [pathname, params] = segments[0].match(regex) || [];
        //6. 매칭이 된게 없으면 넘어갑니다.
        if (!pathname) continue;
        console.log(segments);
        //7. segments의 길이가 1인 경우엔 더이상 탐색할게 없으므로 매칭된 component를 반환한다.
        if (segments.length === 1) {
          return { Component: element, params };
        } else if (children) {
          //8. children이 있을 경우 재귀적으로 traverse를 호출한다.
          return traverse(
            children,
            segments.slice(1),
            errorElement ?? errorComponent
          );
        }
      }
      //9. 매칭된게 없을 경우 errorComopnent반환
      return { Component: errorComponent, params: undefined };
    }
    return traverse(routes, segments);
  };

  const loadRouteComponent = (path: string) => {
    // 현재 경로 받아서 로드하는 함수
    const { Component, params } = matchUrlToRoute(routeInfo.routes ?? [], path); // 현재 경로를 route 트리에서 찾음
    if (!Component) {
      throw new Error('no matching component error');
    } else {
      pageParams = params;
      if (routeInfo.root) {
        while (routeInfo.root.firstChild) {
          routeInfo.root.removeChild(routeInfo.root.firstChild);
        }
        routeInfo.root.appendChild(createElement(Component()));
      } else {
        throw new Error('root element is empty');
      }
    }
  };

  const history = {
    getPageParams() {
      return pageParams;
    },
    replace(path: string) {
      const { pathname, search } = new URL(window.location.origin + path);
      window.history.replaceState({}, '', pathname + search);
      loadRouteComponent(pathname);
    },
    push(path: string) {
      const { pathname, search } = new URL(window.location.origin + path);
      window.history.pushState({}, '', pathname + search);
      loadRouteComponent(pathname);
    },
    back() {
      window.history.back();
    },
    currentPath() {
      return window.location.pathname;
    },
  };
  const router = (root: HTMLElement, routes: Route[]) => {
    routeInfo.root = root;
    routeInfo.routes = routes;

    const customizeAnchorBehavior = () => {
      // a태그 기본 이동 기능 방지
      window.addEventListener('click', (e) => {
        const el = e.target as HTMLElement; // 클릭 이벤트가 발생한 element
        const anchor = el.closest('a[data-link]'); // 클릭한 요소에서 가장 가까운 a 태그 중에서 data-link라는 데이터 속성을 가진 요소
        if (!(anchor instanceof HTMLAnchorElement)) return; // a 태그 아니면 리턴
        if (!anchor) return; // 없어도 리턴
        e.preventDefault(); // 클릭한 요소가 a태그와 가까울때 기본 기능인 route이동 기능 방지
        history.push(anchor.pathname + anchor.search); // 브라우저 히스토리 추가
      });
    };

    const initLoad = () => {
      loadRouteComponent(history.currentPath());
      customizeAnchorBehavior();

      window.addEventListener('popstate', () => {
        loadRouteComponent(history.currentPath());
      });
    };

    initLoad();
  };
  return { history, router };
};

export const { history, router } = spaRouter();
