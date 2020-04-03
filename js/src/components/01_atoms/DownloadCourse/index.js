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
    this.handleDownload = this.handleDownload.bind(this);
  }

  handleDownload() {
    const { course } = this.props;

    this.setState({ loading: true });

    // TODO - replace with API call & handling
    console.log(course);
    window.setTimeout(() => this.setState({ loading: false }), 2000);


    // const request = new Request('/node/281');
    // const aaa = await fetch(request, {mode: 'no-cors'});
    // console.log('aaa', aaa);

    // <script type="application\/json" data-drupal-selector="drupal-settings-json">(.*?)<\/script>

    const moduleIds = course.modules.map((module) => {
      const ids = module.lessons.map((lesson) => lesson.id);
      ids.push(module.assessment.id);
      ids.push(module.id);
      return ids;
    });

    moduleIds.push('/sites/default/files/styles/image_with_caption/public/2020-04/download.jpeg');
    console.log(moduleIds);

    const courseContentIds = moduleIds.flat();

    courseContentIds.map((url) => {
      const request = new Request(url);
      //const request = new Request('/node/' + url);

      fetch(request, {mode: 'no-cors'})
        .then(function (response) {
          //console.log(response);
          // Don't cache redirects or errors.
          if (response.ok) {
            const copy = response.clone();

            console.log(response.text());
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

  render() {
    const { loading } = this.state;

    return (
      <Button
        variant="outlined"
        color="primary"
        startIcon={<GetApp />}
        onClick={this.handleDownload}
        disabled={loading}
      >
        Download course2234

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
