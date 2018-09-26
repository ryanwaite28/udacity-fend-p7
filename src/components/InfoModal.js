import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
  input: {
    display: 'none',
  },
  paper: {
    // position: 'absolute',
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
    maxWidth: '95%'
  }
});

function getModalStyle() {
  return {
    top: `50%`,
    // left: `${left}%`,
    // transform: `translate(-${top}%, -${left}%)`,
    display: 'block',
    margin: 'auto'
  };
}


class InfoModal extends Component {
  render() {
    let { classes } = this.props;
    return (
      <Modal aria-labelledby="simple-modal-title" aria-describedby="simple-modal-description" open={this.props.showModal} onClose={this.props.handleClose}>
        <div className="modal-box">
          <div style={getModalStyle()} className={classes.paper}>
            <Typography variant="title" id="modal-title">
              {this.props.wikidata[1][0]}
            </Typography>

            <br/>

            <p>
              {this.props.wikidata[2][0]}
            </p>
            <p>
              <a title={this.props.wikidata[1][0]} href={this.props.wikidata[3][0]}>Read more on wikipedia</a>
            </p>
          </div>
        </div>
      </Modal>
    );
  }
}

export default withStyles(styles)(InfoModal);
