import { withStyles } from '@material-ui/core';
import { hex2rgba } from '@anu/utilities/helpers';
import AudioBase from '@anu/components/Audio/AudioBase';

export default withStyles((theme) => ({
  container: {
    backgroundColor: hex2rgba(theme.palette.primary.main, 0.08),
  },
}))(AudioBase);
