import React, { Component } from 'react';

import * as utils from '../utils';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';


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
    maxWidth: '95%',
    borderRadius: '0',
  },
  card: {
    maxWidth: '100%',
    borderRadius: '0',
    border: '1px solid grey',
    marginBottom: '10px'
  },
  media: {
    objectFit: 'cover',
  },
});



class VenueCard extends Component {
  render() {
    const { classes, venue } = this.props;
    return (
      <Card className={classes.card}>
        <CardActionArea>
          <CardMedia component="img" className={classes.media} height="175"
            image={utils.getGoogleImage(venue)} title={venue.name} />
          <CardContent>
            <Typography gutterBottom variant="headline" component="h2">
              <span className="venue-name"
                onClick={() => { window.open("https://www.google.com/search?q=" + venue.name + ' ' + venue.location.formattedAddress[venue.location.formattedAddress.length - 2], '_blank') }}
                onKeyPress={(event) => { this.linkspanKeyEnter(event, venue) }}>
                  { venue.name }
              </span>
            </Typography>
            <Typography component="p">
              {
                venue.location.formattedAddress.map((value, index) => {
                  return index === (venue.location.formattedAddress.length - 1) ?
                  <span key={index}><span>{value}</span></span> :
                  (<span  key={index}><span>{value}</span><br/></span>)
                })
              }
            </Typography>
            <br/>
            <Typography component="p">
              { venue.hereNow.summary }
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions>
          <Button size="small" color="primary" onClick={() => { this.props.li_click(venue) }} onKeyPress={(event) => { this.props.liKeyEnter(event, venue) }}>
            Show Marker
          </Button>
        </CardActions>
      </Card>
    );
  }
}


export default withStyles(styles)(VenueCard);
