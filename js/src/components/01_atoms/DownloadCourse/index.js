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
    };

    return (
      <Button
        variant="outlined"
        color="primary"
        startIcon={<GetApp />}
        onClick={handleDownload}
        disabled={loading}
      >
        Download course

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
