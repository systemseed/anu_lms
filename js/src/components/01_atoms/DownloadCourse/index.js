import React from 'react';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import GetApp from '@material-ui/icons/GetApp';

class DownloadCourse extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
    };
  }

  render() {
    const { loading } = this.state;
    const handleDownload = () => {
      const { course } = this.props;

      this.setState({ loading: true });

      // TODO - replace with API call & handling
      console.log(course);
      window.setTimeout(() => this.setState({ loading: false }), 2000);

      const moduleIds = course.modules.map((module) => {
        const ids = module.lessons.map((lesson) => lesson.id);
        ids.push(module.assessment.id);
        ids.push(module.id);
        return ids;
      });
      console.log(moduleIds);
      const courseContentIds = moduleIds.flat();

      courseContentIds.map((url) => {
        const request = new Request(url);

        fetch(request, {mode: 'no-cors'})
          .then(function (response) {
            // Don't cache redirects or errors.
            if (response.ok) {
              const copy = response.clone();

              caches
                .open('pwa-main-8.x-1.3-v1')
                .then(function (cache) {
                  return cache.put(request, copy);
                })
                .catch(function (error) {
                  console.error("Error: ", error);
                });
            }
          })
          .catch(function (error) {
            console.error("PWA: Response not cacheable ", error);
          });
      });
    };

    return (
      <Button
        variant="outlined"
        color="primary"
        startIcon={<GetApp />}
        onClick={handleDownload}
        disabled={loading}
      >
        Download course22

        {loading &&
        <CircularProgress
          size={24}
          style={{ position: 'absolute' }}
        />
        }
      </Button>
    )
  }
}

export default DownloadCourse;
