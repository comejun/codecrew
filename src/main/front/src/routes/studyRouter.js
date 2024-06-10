import { lazy, Suspense } from "react";
import LoadingPage from "../components/common/LoadingPage";

const StudyList = lazy(() => import("../pages/study/ListPage"));
const StudyAdd = lazy(() => import("../pages/study/AddPage"));
const StudyRead = lazy(() => import("../pages/study/ReadPage"));
const StudyModify = lazy(() => import("../pages/study/ModifyPage"));
const Profile = lazy(() => import("../pages/study/ProfilePage"));

const studyRouter = () => {
  return [
    {
      path: "",
      element: (
        // Suspense 컴포넌트로 감싸서 로딩 중일 때 보여줄 컴포넌트를 지정
        <Suspense fallback={<LoadingPage />}>
          <StudyList />
        </Suspense>
      ),
    },
    {
      path: "add",
      element: (
        // Suspense 컴포넌트로 감싸서 로딩 중일 때 보여줄 컴포넌트를 지정
        <Suspense fallback={<LoadingPage />}>
          <StudyAdd />
        </Suspense>
      ),
    },
    {
      path: "add/:lat/:lng",
      element: (
          // Suspense 컴포넌트로 감싸서 로딩 중일 때 보여줄 컴포넌트를 지정
          <Suspense fallback={<LoadingPage />}>
            <StudyAdd />
          </Suspense>
      ),
    },
    {
      path: ":id",
      // todo(no) 작성필요
      element: (
        // Suspense 컴포넌트로 감싸서 로딩 중일 때 보여줄 컴포넌트를 지정
        <Suspense fallback={<LoadingPage />}>
          <StudyRead />
        </Suspense>
      ),
    },
    {
      path: "modify/:id",
      // todo(no) 작성필요
      element: (
        // Suspense 컴포넌트로 감싸서 로딩 중일 때 보여줄 컴포넌트를 지정
        <Suspense fallback={<LoadingPage />}>
          <StudyModify />
        </Suspense>
      ),
    },
    {
      path: "profile/:email",
      // todo(no) 작성필요
      element: (
        // Suspense 컴포넌트로 감싸서 로딩 중일 때 보여줄 컴포넌트를 지정
        <Suspense fallback={<LoadingPage />}>
          <Profile />
        </Suspense>
      ),
    },
  ];
};

export default studyRouter;
