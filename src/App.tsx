/*
* This file demonstrates a basic ReactXP app.
*/

import RX = require('reactxp');
import { default as RXVideo } from 'reactxp-video';

import ProgressIndicator from './ProgressIndicator';
import ToggleSwitch from './ToggleSwitch';

interface AppState {
    toggleValue?: boolean;
    progressValue?: number;
    pickerValue?: string;
}
const _modalId = 'ErrorDialog';
const styles = {
    scroll: RX.Styles.createScrollViewStyle({
        alignSelf: 'stretch',
        // backgroundColor: '#f5fcff'
    }),
    fieldAndControl: RX.Styles.createViewStyle({
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    }),
    borderIt: RX.Styles.createViewStyle({
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'red',
    }),
    label: RX.Styles.createViewStyle({
        // width: 120,
    }),
    container: RX.Styles.createViewStyle({
        padding: 16,
        // justifyContent: 'center',
        // alignItems: 'center'
    }),
    helloWorld: RX.Styles.createTextStyle({
        fontSize: 48,
        fontWeight: 'bold',
        marginBottom: 28
    }),
    welcome: RX.Styles.createTextStyle({
        fontSize: 28,
        marginBottom: 12
    }),
    instructions: RX.Styles.createTextStyle({
        fontSize: 16,
        color: '#aaa',
        marginBottom: 16
    }),
    docLink: RX.Styles.createLinkStyle({
        fontSize: 16,
        color: 'blue',
        marginBottom: 16
    }),
    titleText: RX.Styles.createTextStyle({
        fontSize: 16,
        // textAlign: 'center',
        marginTop: 12,
        color: 'black'
    }),
    videoTitleText: RX.Styles.createTextStyle({
        marginBottom: 8
    }),
    progressMargin: RX.Styles.createViewStyle({
        margin: 8
    }),
    video: RX.Styles.createViewStyle({
        height: 176,
        width: 320
    })
};

class App extends RX.Component<null, AppState> {
    private _translationValue: RX.Animated.Value;
    private _animatedStyle: RX.Types.AnimatedTextStyleRuleSet;
    private _progressTimerToken: number;

    constructor() {
        super();

        this._translationValue = new RX.Animated.Value(-100);
        this._animatedStyle = RX.Styles.createAnimatedTextStyle({
            transform: [
                {
                    translateY: this._translationValue
                }
            ]
        });

        this.state = {
            toggleValue: true,
            pickerValue: "",
            progressValue: 0
        };
    }

    componentDidMount() {
        let animation = RX.Animated.timing(this._translationValue, {
            toValue: 0,
            easing: RX.Animated.Easing.OutBack(),
            duration: 500
        }
        );

        animation.start();

        this._startProgressIndicator();
    }

    componentWillUnmount() {
        this._stopProgressIndicator();
    }

    render(): JSX.Element | null {
        return (
            <RX.ScrollView style={styles.scroll}>
                <RX.View style={styles.container}>
                    <RX.Animated.Text style={[styles.helloWorld, this._animatedStyle]}>
                        Hello World
                    </RX.Animated.Text>
                    <RX.Text style={styles.welcome}>
                        Welcome to ReactXP Excercises
                    </RX.Text>
                    <RX.Text style={styles.instructions}>
                        Edit App.tsx to get started
                    </RX.Text>
                    {/*<RX.Link style={styles.docLink} url={'https://microsoft.github.io/reactxp/docs'}>
                        View ReactXP documentation
                    </RX.Link>*/}

                    <RX.Text style={styles.titleText}>
                        Here is a simple control built using ReactXP
                    </RX.Text>
                    <RX.View style={[styles.fieldAndControl, styles.borderIt]}>
                        <RX.Text style={[styles.borderIt, styles.label]}>
                            {"Turn it On? (" + this.state.pickerValue + ")"}
                        </RX.Text>

                        <RX.View style={styles.borderIt}>
                            <ToggleSwitch
                                value={this.state.toggleValue}
                                onChange={this._onChangeToggle}
                            />
                        </RX.View>
                    </RX.View>

                    <RX.View style={[styles.borderIt]}>
                        <RX.Picker items={[
                            {label: "Label 1", value: "Value 1"},
                            {label: "Label 2", value: "Value 2"},
                            {label: "Label 3", value: "Value 3"},
                        ]}
                        selectedValue={this.state.pickerValue}
                        onValueChange={this._onChangePicker}
                         />
                    </RX.View>

                    <RX.Text style={styles.titleText}>
                        Here is an SVG image using the ImageSvg extension
                    </RX.Text>
                    <ProgressIndicator
                        style={styles.progressMargin}
                        progress={this.state.progressValue}
                        fillColor={'red'}
                        size={32}
                    />

                    <RX.Text style={[styles.titleText, styles.videoTitleText]}>
                        Here is a video using the Video extension
                    </RX.Text>
                    <RXVideo
                        ref='video'
                        style={styles.video}
                        source={'https://www.w3schools.com/html/mov_bbb.mp4'}
                        loop={true}
                        onCanPlay={this._playVideo}
                    />
                </RX.View>
            </RX.ScrollView>

        );
    }

    private _playVideo = () => {
        const video = this.refs['video'] as RXVideo;
        if (video) {
            video.mute(true);
            video.play();
        }
    }

    private _startProgressIndicator() {
        this._progressTimerToken = window.setInterval(() => {
            const newProgressValue = (this.state.progressValue + 0.02) % 1;
            this.setState({ progressValue: newProgressValue });
        }, 1000 / 8);
    }

    private _stopProgressIndicator() {
        if (this._progressTimerToken) {
            window.clearInterval(this._progressTimerToken);
            this._progressTimerToken = undefined;
        }
    }

    // Note that we define this as a variable rather than a normal method. Using this
    // method, we prebind the method to this component instance. This prebinding ensures
    // that each time we pass the variable as a prop in the render function, it will
    // not change. We want to avoid unnecessary prop changes because this will trigger
    // extra work within React's virtual DOM diffing mechanism.
    private _onChangeToggle = (newValue: boolean) => {
        this.setState({ toggleValue: newValue });
        this.showDialog()
    }

    private _onChangePicker = (itemValue: string, itemPosition: number) => {
        this.setState({ pickerValue: itemValue });
    }

    private showDialog() {
        let dialog = (
            <RX.View style={styles.borderIt}>
                <RX.Text style={styles.borderIt}>
                    你点对了！
            </RX.Text>
                <RX.Button style={styles.borderIt}
                >
                    <RX.Text style={styles.borderIt} onPress={this.dismissDialog}>
                        关掉
                </RX.Text>
                </RX.Button>
            </RX.View>
        );

        RX.Modal.show(dialog, _modalId);
    }

    private dismissDialog() {
        RX.Modal.dismiss(_modalId);
    }

}

export = App;
