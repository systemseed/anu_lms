import React from 'react';
import { connect } from 'react-redux';
import { HashRouter, Switch, Route, Redirect } from 'react-router-dom';
import { isWidthUp, withWidth } from '@material-ui/core'
import Box from '@material-ui/core/Box';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Heading from '../../01_atoms/Heading';
import Paragraphs from '../../02_moleculas/Paragraphs';
import LessonSectionNavigation from '../../02_moleculas/LessonSectionNavigation';
import LessonSidebar from '../../03_organisms/LessonSidebar';
import LessonNavigationButton from '../../01_atoms/LessonNavigationButton';
import LessonGrid from '../../01_atoms/LessonGrid';
import * as lessonActions from '../../../redux/actions/lesson';

const StyledWrapperBox = withStyles({
  root: {
    position: 'relative',
  }
})(Box);

const useSidebarStyles = makeStyles({
  root: ({ isSidebarVisible }) => ({
    background: '#e8e8e8',
    color: '#3e3e3e',
    position: 'absolute',
    left: isSidebarVisible ? 0 : '-220px',
    bottom: 0,
    top: 0,
    width: '220px',
    transition: 'all .3s',
    minHeight: '100vh', // TODO: Ugly hack, should find something better than this!
    zIndex: 10,
  })
});

const StyledSidebar = ({ isSidebarVisible, children, ...props }) => {
  const classes = useSidebarStyles({ isSidebarVisible });
  return <Box className={classes.root} {...props}>{children}</Box>;
};

const useSidebarInnerStyles = makeStyles({
  root: ({ sidebarTopOffset }) => ({
    position: sidebarTopOffset <= 0 ? 'static' : 'fixed',
    top: sidebarTopOffset,
    width: '220px',
  })
});

const StyledSidebarInner = ({ sidebarTopOffset, children }) => {
  const classes = useSidebarInnerStyles({ sidebarTopOffset });
  return <Box className={classes.root}>{children}</Box>;
};

const useMainContentStyles = makeStyles(theme => ({
  root: {
    transition: 'all .3s',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      marginLeft: ({ isSidebarVisible }) => isSidebarVisible ? '220px' : 0,
      paddingTop: theme.spacing(6),
      paddingBottom: theme.spacing(4),
    },
  }
}));

const StyledMainContent = ({ isSidebarVisible, children }) => {
  const classes = useMainContentStyles({ isSidebarVisible });
  return <Box className={classes.root}>{children}</Box>;
};

const StyledMobileOverlay = withStyles(theme => ({
  root: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.3)',
    zIndex: 5,
    minHeight: '100vh', // TODO: Ugly hack, should find something better than this!
  }
}))(Box);

class Lesson extends React.Component {

  constructor (props) {
    super(props);

    this.state = {
      sidebarTopOffset: 0,
    };

    const { module } = props.node;

    this.nextLesson = null;
    const lessonIndex = module.lessons.findIndex(lesson => lesson.id === props.node.id);
    if (lessonIndex >= 0 && typeof module.lessons[lessonIndex + 1] !== 'undefined') {
      this.nextLesson = module.lessons[lessonIndex + 1];
    }

    this.onPageScroll = this.onPageScroll.bind(this);
  }

  componentDidMount() {
    window.addEventListener('scroll', this.onPageScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.onPageScroll);
  }

  onPageScroll() {
    const { sidebarTopOffset } = this.state;
    const bodyPaddingTop = Number.parseInt(document.body.style.paddingTop, 10);
    const newSidebarTopOffset = this.getSidebarTopOffset() > 0 ? 0 : bodyPaddingTop;
    if (sidebarTopOffset !== newSidebarTopOffset) {
      this.setState({ sidebarTopOffset: newSidebarTopOffset });
    }
  };

  getSidebarTopOffset() {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) {
      return 0;
    }

    const sidebarPosition = sidebar.getBoundingClientRect();
    const sidebarFromTop = sidebarPosition.top;

    const bodyTopPadding = Number.parseInt(document.body.style.paddingTop, 10);

    return sidebarFromTop - bodyTopPadding;
  }

  render() {
    const { node, width, dispatch, isSidebarVisibleOnDesktop, isSidebarVisibleOnMobile } = this.props;
    const { sidebarTopOffset } = this.state;

    const isSidebarVisible = isWidthUp('sm', width) ? isSidebarVisibleOnDesktop : isSidebarVisibleOnMobile;

    return (
      <StyledWrapperBox>

        {isSidebarVisibleOnMobile && !isWidthUp('sm', width) &&
        <StyledMobileOverlay onClick={() => dispatch(lessonActions.toggleSidebarOnMobile())} />
        }

        <StyledSidebar isSidebarVisible={isSidebarVisible} id="sidebar">
          <StyledSidebarInner sidebarTopOffset={sidebarTopOffset}>
            <LessonSidebar module={node.module} />
          </StyledSidebarInner>
        </StyledSidebar>

        <StyledMainContent isSidebarVisible={isSidebarVisible}>
          <Heading type="h1">{node.title}</Heading>

          {node.sections.length > 1 &&
          <HashRouter hashType="noslash">
            <Switch>
              <Redirect exact from="/" to="/section-1"/>
              {node.sections.map((paragraphs, index) =>
                <Route path={`/section-${index + 1}`} key={index} exact>

                  {/* Render all page paragraphs */}
                  <Paragraphs items={paragraphs} />

                  {/* Render NEXT buttons at the end of the page */}
                  <LessonSectionNavigation lesson={node} nextLesson={this.nextLesson} currentIndex={index} />

                </Route>
              )}
            </Switch>
          </HashRouter>
          }

          {node.sections.length === 1 && node.sections.map((paragraphs, index) =>
            <React.Fragment key={index} >

              {/* Render all page paragraphs */}
              <Paragraphs items={paragraphs} />

              {/* Render NEXT button at the end of the page */}
              {this.nextLesson &&
              <LessonGrid>
                <LessonNavigationButton href={this.nextLesson.path}>
                  Next lesson: {this.nextLesson.title}
                </LessonNavigationButton>
              </LessonGrid>
              }

              {/* Button that takes to the assessment */}
              {!this.nextLesson && node.module && node.module.assessment &&
              <LessonGrid>
                <LessonNavigationButton href={node.module.assessment.path}>
                  Go to the module assessment
                </LessonNavigationButton>
              </LessonGrid>
              }
            </React.Fragment>
          )}

        </StyledMainContent>

      </StyledWrapperBox>
    )
  }
}

const mapStateToProps = ({ lesson }) => ({
  isSidebarVisibleOnDesktop: lesson.isSidebarVisibleOnDesktop,
  isSidebarVisibleOnMobile: lesson.isSidebarVisibleOnMobile,
});

export default connect(mapStateToProps)(withWidth()(Lesson));
