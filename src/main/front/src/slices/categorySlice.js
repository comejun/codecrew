import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllStudyLocation } from "../api/mapAPI";

// 두 좌표 사이의 거리를 계산하는 함수
function calculateDistance(location1, location2) {
  const R = 6371; // 지구의 반지름 (km)
  const dLat = ((location2.locationY - location1.lat) * Math.PI) / 180;
  const dLng = ((location2.locationX - location1.lng) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((location1.lat * Math.PI) / 180) *
      Math.cos((location2.locationY * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
}

export const getStudyLocationList = createAsyncThunk(
  "category/getStudyLocationList",
  async (category, thunkAPI) => {
    const data = await getAllStudyLocation(category);
    return data;
  },
);

export const setMyLocation = createAsyncThunk(
  "category/setMyLocation",
  async (_, thunkAPI) => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              get: true,
            });
          },
          (error) => {
            reject(error);
          },
        );
      } else {
        reject(new Error("Geolocation is not supported by this browser."));
      }
    });
  },
);

const initState = {
  category: "ALL",
  studyLocationList: [],
  status: "idle",
  error: null,
  myLocation: { lat: 37.57163048751097, lng: 126.97591715920376 }, // 현재 위치를 상태에 추가
};

const categorySlice = createSlice({
  name: "CategorySlice",
  initialState: initState,
  reducers: {
    setCategory: (state, action) => {
      console.log("Setting category:", action.payload);
      state.category = action.payload;
    },
    sortStudyLocationList: (state) => {
      // 정렬 액션 추가
      state.studyLocationList.sort((a, b) => {
        const distanceA = calculateDistance(state.myLocation, a);
        const distanceB = calculateDistance(state.myLocation, b);

        return distanceA - distanceB;
      });
    },
    // 검색어에 따라 필터링하는 액션 추가
    filterStudyLocationList: (state, action) => {
      state.studyLocationList = state.studyLocationList.filter(
        (studyLocation) => {
          return studyLocation.title.includes(action.payload);
        },
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getStudyLocationList.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getStudyLocationList.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.studyLocationList = action.payload;
      })
      .addCase(getStudyLocationList.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(setMyLocation.fulfilled, (state, action) => {
        state.myLocation = action.payload;
      })
      .addCase(setMyLocation.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export const { setCategory, sortStudyLocationList, filterStudyLocationList } =
  categorySlice.actions;
export default categorySlice.reducer;
