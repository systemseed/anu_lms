const initialState = {
  isSidebarVisibleOnDesktop: true,
  isSidebarVisibleOnMobile: false,
};

export default (state = initialState, action) => {
  switch (action.type) {

    case 'LESSON.SIDEBAR_TOGGLE_DESKTOP':
      return {...state, isSidebarVisibleOnDesktop: !state.isSidebarVisibleOnDesktop};

    case 'LESSON.SIDEBAR_TOGGLE_MOBILE':
      return {...state, isSidebarVisibleOnMobile: !state.isSidebarVisibleOnMobile};

    default:
      return state;
  }
};
