/**
 * Created by shine on 2020/4/8
 */
'use strict';

import React, {PropTypes, PureComponent} from 'react'
import {
    requireNativeComponent,
    View,
    UIManager,
    DeviceEventEmitter,
    ActivityIndicator,
    Linking,
    Image,
    StyleSheet,
    findNodeHandle,
    Text,
} from 'react-native';
import invariant from 'invariant';
import escapeStringRegexp from 'escape-string-regexp';
import {WebView} from 'react-native-webview';

let RCTX5WebView = null;
let _X5WebView
const viewConfig = UIManager.getViewManagerConfig('X5WebView');
if (viewConfig != null && viewConfig.NativeProps != null) {
    RCTX5WebView = requireNativeComponent('X5WebView');

    let __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    let __generator = (this && this.__generator) || function (thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    };

    let __spreadArrays = (this && this.__spreadArrays) || function () {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    };

    let resolveAssetSource = Image.resolveAssetSource;
    let __rest = (this && this.__rest) || function (s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    };

    let defaultOriginWhitelist = ['http://*', 'https://*'];

    let extractOrigin = function (url) {
        let result = /^[A-Za-z][A-Za-z0-9+\-.]+:(\/\/)?[^/]*/.exec(url);
        return result === null ? '' : result[0];
    };
    let originWhitelistToRegex = function (originWhitelist) {
        return "^" + escapeStringRegexp(originWhitelist).replace(/\\\*/g, '.*');
    };
    let passesWhitelist = function (compiledWhitelist, url) {
        let origin = extractOrigin(url);
        return compiledWhitelist.some(function (x) { return new RegExp(x).test(origin); });
    };
    let compileWhitelist = function (originWhitelist) {
        return __spreadArrays(['about:blank'], (originWhitelist || [])).map(originWhitelistToRegex);
    };

    let createOnShouldStartLoadWithRequest = function(loadRequest, originWhitelist, onShouldStartLoadWithRequest) {
        return function (_a) {
            let nativeEvent = _a.nativeEvent;
            let shouldStart = true;
            let url = nativeEvent.url, lockIdentifier = nativeEvent.lockIdentifier;
            if (!passesWhitelist(compileWhitelist(originWhitelist), url)) {
                Linking.openURL(url);
                shouldStart = false;
            }
            if (onShouldStartLoadWithRequest) {
                shouldStart = onShouldStartLoadWithRequest(nativeEvent);
            }
            loadRequest(shouldStart, url, lockIdentifier);
        };
    };

    class X5WebView extends PureComponent {

        constructor(props) {
            super(props);
            this.startUrl = null;
            this.state = {
                viewState: props.startInLoadingState ? 'LOADING' : 'IDLE',
                lastErrorEvent: null
            };
        }

        setNativeProps(props) {
            this._ref && this._ref.setNativeProps(props);
        }

        render() {
            let _a = this.props, onMessage = _a.onMessage, onShouldStartLoadWithRequestProp = _a.onShouldStartLoadWithRequest, originWhitelist = _a.originWhitelist, renderError = _a.renderError, renderLoading = _a.renderLoading, source = _a.source, style = _a.style, containerStyle = _a.containerStyle, _b = _a.nativeConfig, nativeConfig = _b === void 0 ? {} : _b, otherProps = __rest(_a, ["onMessage", "onShouldStartLoadWithRequest", "originWhitelist", "renderError", "renderLoading", "source", "style", "containerStyle", "nativeConfig"]);
            let otherView = null;
            if (this.state.viewState === 'LOADING') {
                otherView = (renderLoading || this._defaultRenderLoading)();
            }
            else if (this.state.viewState === 'ERROR') {
                let errorEvent = this.state.lastErrorEvent;
                invariant(errorEvent != null, 'lastErrorEvent expected to be non-null');
                otherView = (renderError || this._defaultRenderError)(errorEvent.domain, errorEvent.code, errorEvent.description);
            }
            else if (this.state.viewState !== 'IDLE') {
                console.error("RNCWebView invalid state encountered: " + this.state.viewState);
            }
            let webViewStyles = [styles.container, styles.webView, style];
            let webViewContainerStyle = [styles.container, containerStyle];
            if (source && 'method' in source) {
                if (source.method === 'POST' && source.headers) {
                    console.warn('WebView: `source.headers` is not supported when using POST.');
                }
                else if (source.method === 'GET' && source.body) {
                    console.warn('WebView: `source.body` is not supported when using GET.');
                }
            }
            let onShouldStartLoadWithRequest = createOnShouldStartLoadWithRequest(this.onShouldStartLoadWithRequestCallback, 
                // casting cause it's in the default props
                originWhitelist, onShouldStartLoadWithRequestProp);
            return(
                <RCTX5WebView
                    ref={(ref)=>this._ref = ref}
                    {...this.props}
                    messagingEnabled={typeof this.props.onMessage === 'function'} 
                    onLoadingError={this.onLoadingError} 
                    onLoadingFinish={this.onLoadingFinish} 
                    onLoadingProgress={this.onLoadingProgress} 
                    onLoadingStart={this.onLoadingStart} 
                    onHttpError={this.onHttpError} 
                    onMessage={this.onMessage} 
                    onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
                    source={resolveAssetSource(source)} 
                    style={webViewStyles}
                />
            );
        };

        goForward(){
            let handle = this.getWebViewHandle();
            if(handle){
                UIManager.dispatchViewManagerCommand(handle, this.getCommands().goForward, undefined);
            }
            
        };

        goBack(){
            let handle = this.getWebViewHandle();
            if(handle){
                UIManager.dispatchViewManagerCommand(handle, this.getCommands().goBack, undefined);
            }
            
        };

        reload(){
            this.setState({
                viewState: 'LOADING'
            });
            let handle = this.getWebViewHandle();
            if(handle){
                UIManager.dispatchViewManagerCommand(handle, this.getCommands().reload, undefined);
            }
            
        };

        stopLoading(){
            let handle = this.getWebViewHandle();
            if(handle){
                UIManager.dispatchViewManagerCommand(handle, this.getCommands().stopLoading, undefined);
            }
            
        };

        requestFocus(){
            let handle = this.getWebViewHandle();
            if(handle){
                UIManager.dispatchViewManagerCommand(handle, this.getCommands().requestFocus, undefined);
            }
            
        };

        postMessage(data){
            let handle = this.getWebViewHandle();
            if(handle){
                UIManager.dispatchViewManagerCommand(handle, this.getCommands().postMessage, [String(data)]);
            }
            
        };

        injectJavaScript(data){
            let handle = this.getWebViewHandle();
            if(handle){
                UIManager.dispatchViewManagerCommand(handle, this.getCommands().injectJavaScript, [data]);
            }
            
        };

        getCommands(){
            return UIManager.getViewManagerConfig('RNCWebView').Commands;
        };

        updateNavigationState(event){
            if (this.props.onNavigationStateChange) {
                this.props.onNavigationStateChange(event.nativeEvent);
            }
        }

        onLoadingStart=(event)=>{
            let onLoadStart = this.props.onLoadStart;
            let url = event.nativeEvent.url;
            this.startUrl = url;
            if (onLoadStart) {
                onLoadStart(event);
            }
            this.updateNavigationState(event);
        };

        onLoadingError=(event)=>{
            event.persist(); // persist this event because we need to store it
            let a = this.props, onError = a.onError, onLoadEnd = a.onLoadEnd;
            if (onError) {
                onError(event);
            }
            if (onLoadEnd) {
                onLoadEnd(event);
            }
            console.warn('Encountered an error loading page', event.nativeEvent);
            this.setState({
                lastErrorEvent: event.nativeEvent,
                viewState: 'ERROR'
            });
        };

        onHttpError=(event)=>{
            let onHttpError = this.props.onHttpError;
            if (onHttpError) {
                onHttpError(event);
            }
        };

        onLoadingFinish=(event)=>{
            let a = this.props, onLoad = a.onLoad, onLoadEnd = a.onLoadEnd;
            let url = event.nativeEvent.url;
            if (onLoad) {
                onLoad(event);
            }
            if (onLoadEnd) {
                onLoadEnd(event);
            }
            if (url === this.startUrl) {
                this.setState({
                    viewState: 'IDLE'
                });
            }
            this.updateNavigationState(event);
        };
        
        onMessage=(event)=>{
            let onMessage = this.props.onMessage;
            if (onMessage) {
                onMessage(event);
            }
        };
        
        onLoadingProgress=(event)=>{
            let onLoadProgress = this.props.onLoadProgress;
            let progress = event.nativeEvent.progress;
            if (progress === 1) {
                this.setState(function (state) {
                    if (state.viewState === 'LOADING') {
                        return { viewState: 'IDLE' };
                    }
                    return null;
                });
            }
            if (onLoadProgress) {
                onLoadProgress(event);
            }
        };

        onShouldStartLoadWithRequestCallback(shouldStart, url) {
            if (shouldStart) {
                let handle = this.getWebViewHandle();
                if(handle){
                    UIManager.dispatchViewManagerCommand(handle, this.getCommands().loadUrl, [String(url)]);
                }
                
            }
        };


        getWebViewHandle(){
            if(!this._ref){
                return null;
            }
            return findNodeHandle(this._ref);
        };

        _defaultRenderLoading(){
            return (<View style={styles.loadingOrErrorView}>
                <ActivityIndicator />
              </View>);
        }

        _defaultRenderError(errorDomain, errorCode, errorDesc){
            return (<View style={styles.loadingOrErrorView}>
                <Text style={styles.errorTextTitle}>Error loading page</Text>
                <Text style={styles.errorText}>{"Domain: " + errorDomain}</Text>
                <Text style={styles.errorText}>{"Error Code: " + errorCode}</Text>
                <Text style={styles.errorText}>{"Description: " + errorDesc}</Text>
              </View>);
        }

        


    }

    X5WebView.isFileUploadSupported = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            // native implementation should return "true" only for Android 5+
            return [2 /*return*/, NativeModules.X5WebView.isFileUploadSupported()];
        });
    }); };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            overflow: 'hidden'
        },
        loadingOrErrorView: {
            position: 'absolute',
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            width: '100%',
            backgroundColor: '#FFFFFFFF'
        },
        loadingProgressBar: {
            height: 20
        },
        errorText: {
            fontSize: 14,
            textAlign: 'center',
            marginBottom: 2
        },
        errorTextTitle: {
            fontSize: 15,
            fontWeight: '500',
            marginBottom: 10
        },
        webView: {
            backgroundColor: '#FFFFFF'
        }
});

_X5WebView = X5WebView;

}




module.exports = RCTX5WebView === null?WebView:_X5WebView