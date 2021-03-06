import React from 'react'
import Card, { CardActions, CardContent } from 'material-ui/Card';
import { CircularProgress } from 'material-ui/Progress';
import Grid from 'material-ui/Grid';
import IconButton from 'material-ui/IconButton'
import List from 'material-ui/List'
import Typography from 'material-ui/Typography'
import styled from 'styled-components'
import { compose, lifecycle, setDisplayName, withStateHandlers } from 'recompose'
import { inject, observer } from 'mobx-react'
import SubmissionCard from './SubmissionCard'
import Sensor from 'react-visibility-sensor'
import DescriptionIcon from 'material-ui-icons/ChromeReaderMode'
import { Toolbar } from './'
import SortRedditButton from './SortRedditButton'

const enhance = compose(
    inject('viewStore'),
    inject('subredditStore'),
    inject('submissionStore'),
    setDisplayName('SubmissionList'),
    withStateHandlers({

    }, {
            checkBottomReach: (state, props) => (isVisible) => console.log('visible', isVisible) || isVisible && props.subredditStore.fetchMore(),
        }),
    observer,
)
const SubmissionList = styled.div`
    position: relative;
    padding-top: 64px !important;    
`

const SubredditTitle = styled(Typography) `
    margin-right: 16px !important;
`

const Container = styled.div`
    overflow-y: auto;
    height: calc(100vh - 128px);
    padding: 8px 0px 16px 0px !important;
`

const LoadingContainer = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    padding-top: 18px;
`
const LoadMore = styled.div`

`
const ToolbarCenter = styled.div`
    flex: 1;
`

export default enhance((props) => {
    return (
        <SubmissionList>
            <Toolbar >
                <SubredditTitle type="subheading" color="contrast" >
                    {props.subredditStore.subreddit ? `/r/${props.subredditStore.subreddit.display_name}` : 'Front Page'}
                </SubredditTitle>
                <ToolbarCenter>
                    <SortRedditButton />
                </ToolbarCenter>
                <IconButton onClick={props.subredditStore.toggleDescription} color={props.subredditStore.showDescription ? 'accent' : undefined}>
                    <DescriptionIcon />
                </IconButton>
            </Toolbar>
            <Container container direction='row' justify='center'>
                {
                    props.subredditStore.loading
                        ? <LoadingContainer>
                            <CircularProgress />
                        </LoadingContainer>
                        : props.subredditStore.submissions.map(d => {
                            return (
                                <SubmissionCard submission={d} />
                            )
                        })
                }
                {
                    props.subredditStore.loadingMore && !props.subredditStore.loading
                        ? <LoadingContainer>
                            <CircularProgress />
                        </LoadingContainer>
                        : <Sensor onChange={props.checkBottomReach} scrollCheck />
                }
                <span>.</span>
            </Container>
        </SubmissionList>
    )
}
)
