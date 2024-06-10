import { lazy, Suspense } from "react";
import LoadingPage from "../components/common/LoadingPage";

const Mypage = lazy(() => import("../pages/mypage/ReadPage"));
const ModifyPage = lazy(() => import("../pages/mypage/ModifyPage"));
const AlarmPage = lazy(() => import("../pages/mypage/AlarmPage"));
const MyStudyCretPagePage = lazy(() =>
  import("../pages/mypage/MyStudyCretPage")
);
const MyStudyJoinPagePage = lazy(() =>
  import("../pages/mypage/MyStudyJoinPage")
);

const mypageRouter = () => {
  return [
    {
      path: "",
      element: (
        // Suspense 컴포넌트로 감싸서 로딩 중일 때 보여줄 컴포넌트를 지정
        <Suspense fallback={<LoadingPage />}>
          <Mypage />
        </Suspense>
      ),
    },
    {
      path: "modify",
      element: (
        // Suspense 컴포넌트로 감싸서 로딩 중일 때 보여줄 컴포넌트를 지정
        <Suspense fallback={<LoadingPage />}>
          <ModifyPage />
        </Suspense>
      ),
    },
    {
      path: "Alarm",
      element: (
        // Suspense 컴포넌트로 감싸서 로딩 중일 때 보여줄 컴포넌트를 지정
        <Suspense fallback={<LoadingPage />}>
          <AlarmPage />
        </Suspense>
      ),
    },
    {
      path: "createstudy",
      element: (
        // Suspense 컴포넌트로 감싸서 로딩 중일 때 보여줄 컴포넌트를 지정
        <Suspense fallback={<LoadingPage />}>
          <MyStudyCretPagePage />
        </Suspense>
      ),
    },
    {
      path: "joinstudy",
      element: (
        // Suspense 컴포넌트로 감싸서 로딩 중일 때 보여줄 컴포넌트를 지정
        <Suspense fallback={<LoadingPage />}>
          <MyStudyJoinPagePage />
        </Suspense>
      ),
    },
  ];
};

export default mypageRouter;
