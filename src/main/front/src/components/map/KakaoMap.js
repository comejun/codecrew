import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getStudyLocationList } from "../../slices/categorySlice";
import useCustomMap from "../../hooks/useCustomMap";

const { kakao } = window;

const KakaoMap = ({ overlayState, changeOverlayState, changePopup }) => {
  // 셀렉터로 카테고리 가져오기
  const categoryFilter = useSelector((state) => state.categorySlice.category);
  const studyLocationList = useSelector(
    (state) => state.categorySlice.studyLocationList,
  );
  const dispatch = useDispatch();

  const {
    myLocation,
    myLocationMarker,
    clustererMarkers,
    createMapClickMarker,
  } = useCustomMap();

  const [nowMarker, setNowMarker] = useState(null);
  const [mapClickMarker, setMapClickMarker] = useState(null);
  // 지도 중복 렌더링 방지 위해 state로 관리
  const [renderCheck, setRenderCheck] = useState(false);
  const [map, setMap] = useState(null);
  const [cluster, setCluster] = useState();
  // 현재 로그인 된 회원의 이메일 가져오기
  const loginState = useSelector((state) => state.loginSlice);

  // 내 위치로 이동
  const moveToMyLocation = () => {
    const moveLatLon = new kakao.maps.LatLng(myLocation.lat, myLocation.lng);
    map.setCenter(moveLatLon);
  };

  // 지도 클릭시 실행될 함수
  const mapClickedFunc = (mouseEvent) => {
    if (!overlayState.overlayState) {
      console.log(overlayState.overlayState);
      console.log("mapClickedFunc 실행");

      let newMapClickMarker = createMapClickMarker(mouseEvent.latLng);
      console.log("mouseEvent.latLng.getLat() : ", mouseEvent.latLng.getLat());
      console.log("mouseEvent.latLng.getLng() : ", mouseEvent.latLng.getLng());
      newMapClickMarker.setMap(map);
      setMapClickMarker(newMapClickMarker);
      map.panTo(mouseEvent.latLng);
      // 현재 화면 height px값 가져오기
      const height = window.innerHeight;
      console.log("height : ", height);
      //Todo 마커 움직이는 높이 조절 필요
      // setTimeout(() => {
      //   map.panBy(0, height / 8);
      // }, 500); // 500ms 후에 실행
      map.setDraggable(false);
      map.setZoomable(false);
      changeOverlayState(
        mouseEvent.latLng.getLat(),
        mouseEvent.latLng.getLng(),
        true,
      );
      kakao.maps.event.removeListener(map, "dblclick", mapClickedFunc);
    }
  };

  // 지도 생성
  useEffect(() => {
    if (renderCheck) {
      console.log("실제 지도 렌더링");
      const container = document.getElementById("map");
      const options = {
        center: new kakao.maps.LatLng(myLocation.lat, myLocation.lng),
        level: 3,
        disableDoubleClickZoom: true,
      };
      setMap(new kakao.maps.Map(container, options));
    }
  }, [renderCheck]);

  // 현재 위치 받아 오면 마커 생성
  useEffect(() => {
    if (myLocation.get) {
      console.log("현위치 마커 state에 저장");
      setNowMarker(myLocationMarker);
    }
  }, [myLocation.get]);

  // 카테고리 필터링데이터 가져오기
  useEffect(() => {
    dispatch(getStudyLocationList(categoryFilter)).then(() => {
      console.log("studyLocationList 가져오기");
    });
  }, [categoryFilter]);

  // 현재위치 체크 및 studyLocationList가져오면 지도 렌더링 가능
  useEffect(() => {
    if (studyLocationList.length > 0 && myLocation.isLoaded === true) {
      setRenderCheck(true);
    }
  }, [studyLocationList, myLocation.isLoaded]);

  // 지도 렌더링 후 실행될 함수
  useEffect(() => {
    if (map !== null) {
      console.log("지도 렌더링 후 실행");

      // 로그인 시에만
      if (loginState.email) {
        // 지도 더블 클릭 이벤트 등록
        /*kakao.maps.event.addListener(map, "dblclick", function (mouseEvent) {
            mapClickedFunc(mouseEvent);
          });*/
        kakao.maps.event.addListener(map, "dblclick", mapClickedFunc);
      }

      if (nowMarker !== null) {
        console.log("현위치 마커 지도에 추가");
        console.log(nowMarker);
        nowMarker.setMap(map);
      }
    }
  }, [map]);

  // 지도 렌더링 후 마커 클러스터 생성
  useEffect(() => {
    if (map && studyLocationList.length > 0) {
      console.log("클러스터 생성");

      // 현재 지도의 중심 좌표를 저장합니다.
      const currentCenter = map.getCenter();

      const newCluster = new kakao.maps.MarkerClusterer({
        map: map,
        averageCenter: true,
        minLevel: 7,
        disableClickZoom: true,
      });

      // clusterMarkers함수에 changePopup함수를 인자로 넘겨주어 마커 클릭시 팝업창을 띄울 수 있도록 함
      const markers = clustererMarkers(changePopup);

      // 마커 클러스터에 기존 마커 지우기
      if (cluster != undefined) cluster.clear();

      console.log("클러스터에 마커 추가");

      // 클러스터에 마커 추가
      newCluster.addMarkers(markers);

      setCluster(newCluster);

      // 클러스터가 변경된 후에 이전에 저장한 중심 좌표를 다시 지도의 중심으로 설정합니다.
      map.setCenter(currentCenter);
    }
  }, [map, categoryFilter]);

  // 클릭 마커 지우기
  useEffect(() => {
    resetMarker();
  }, [overlayState]);

  const resetMarker = () => {
    if (!overlayState.overlayState && map != null) {
      console.log("overlayState가 false일때 실행됨", overlayState.overlayState);
      console.log(mapClickMarker);
      if (mapClickMarker != null) {
        mapClickMarker.setMap(null);
      }
      map.setDraggable(true);
      map.setZoomable(true);
      kakao.maps.event.addListener(map, "dblclick", mapClickedFunc);
    }
  };

  return (
    <>
      <div
        id="map"
        style={{
          width: "100%",
          height: "calc(100vh - 52px)",
          position: "relative",
        }}
      >
        {/*내위치 이동 버튼*/}
        <div
          onClick={moveToMyLocation}
          style={{
            position: "absolute",
            top: "62px",
            right: "16px",
            zIndex: 10,
            cursor: "pointer",
          }}
        >
          <img src="assets/imgs/icon/mylocationBtn.svg" alt="myLocation" />
        </div>
        {/*내위치 마커 띄우기*/}
      </div>
    </>
  );
};

export default KakaoMap;
