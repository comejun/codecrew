import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getStudyLocationList } from "../../slices/categorySlice";
import { API_SERVER_HOST } from "../../api/studyAPI";
const { kakao } = window;

const FinalKakaoMap = ({ changePopup, popupInit }) => {
  const [map, setMap] = useState();
  const [isLoadingMap, setIsLoadingMap] = useState(true);
  const [cluster, setCluster] = useState();
  const [myLocation, setMyLocation] = useState({
    lat: 37.57163048751097,
    lng: 126.97591715920376,
    get: false,
  });
  const host = API_SERVER_HOST;

  // 셀렉터로 카테고리 가져오기
  const categoryFilter = useSelector((state) => state.categorySlice.category);
  const studyLocationList = useSelector(
    (state) => state.categorySlice.studyLocationList,
  );
  const dispatch = useDispatch();

  // 내 위치로 이동
  const moveToMyLocation = () => {
    const moveLatLon = new kakao.maps.LatLng(myLocation.lat, myLocation.lng);
    map.setCenter(moveLatLon);
  };

  // 내 위치 가져오기
  useEffect(() => {
    console.log("위치정보 받아오기");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setMyLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          get: true,
        });
      });
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }, []);

  // 현위치 가져오면 마커 띄우기
  useEffect(() => {
    if (map && myLocation.get) {
      const markerPosition = new kakao.maps.LatLng(
        myLocation.lat,
        myLocation.lng,
      );
      const markerImage = new kakao.maps.MarkerImage(
        "assets/imgs/icon/oval.svg",
        new kakao.maps.Size(50, 50),
        { offset: new kakao.maps.Point(25, 25) },
      );
      const marker = new kakao.maps.Marker({
        position: markerPosition,
        image: markerImage,
      });
      console.log("현위치 마커 생성");
      marker.setMap(map);
    }
  }, [map, myLocation.get]);

  // 카테고리 필터링데이터 가져오기
  useEffect(() => {
    dispatch(getStudyLocationList(categoryFilter)).then(() => {
      console.log("studyLocationList 가져오기");
      // console.log(studyLocationList);
    });
  }, [categoryFilter]);

  // 마커 클러스터 생성
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

      const markers = studyLocationList.map((location) => {
        // console.log("location : ", location);
        let popupImg = location.thImg;
        if (!location.thImg.startsWith("http")) {
          popupImg = `${host}/api/image/view/${location.thImg}`;
        }
        const popupData = {
          id: location.id,
          thImg: popupImg,
          title: location.title,
          location: location.location,
          content: location.content,
          memberNickname: location.memberNickname,
          memberEmail: location.memberEmail,
          memberPhone: location.memberPhone,
          studyDate: location.studyDate,
          maxPeople: location.maxPeople,
          clickable: true,
        };

        var imageSrc = "/assets/imgs/icon/ic_map.svg", // 마커이미지의 주소입니다
          imageSize = new kakao.maps.Size(50, 50), // 마커이미지의 크기입니다
          imageOption = { offset: new kakao.maps.Point(25, 50) }; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.

        // 마커의 이미지정보를 가지고 있는 마커이미지를 생성합니다
        var markerImage = new kakao.maps.MarkerImage(
          imageSrc,
          imageSize,
          imageOption,
        );

        let marker = new kakao.maps.Marker({
          position: new kakao.maps.LatLng(
            location.locationY,
            location.locationX,
          ),
          image: markerImage,
        });
        kakao.maps.event.addListener(marker, "click", function () {
          changePopup(popupData);
        });
        return marker;
      });

      // 마커 클러스터에 마커 지우기
      if (cluster != undefined) cluster.clear();

      console.log("클러스터에 마커 추가");
      // 클러스터 초기화
      newCluster.addMarkers(markers);

      setCluster(newCluster);

      // MarkerClusterer 객체 출력
      console.log(newCluster);

      // 추가된 마커의 수 출력
      console.log(newCluster.getMarkers().length);

      // 클러스터가 변경된 후에 이전에 저장한 중심 좌표를 다시 지도의 중심으로 설정합니다.
      map.setCenter(currentCenter);
    }
  }, [map, studyLocationList, categoryFilter]);

  // 지도 렌더링 (내 위치 기준, 현위치 모르면 기본 위치)
  useEffect(() => {
    if (myLocation) {
      console.log("myLocation : ", myLocation);
      const container = document.getElementById("map");
      const options = {
        center: new kakao.maps.LatLng(myLocation.lat, myLocation.lng),
        level: 3,
      };
      const map1 = new kakao.maps.Map(container, options);
      setMap(map1);
      setIsLoadingMap(false);
    }
  }, [myLocation]);

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
export default FinalKakaoMap;
