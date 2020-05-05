/**
 * @file index.js
 * @author swan
 */
import md5 from '../../common/md5.js'

const app = getApp()

Page({
    data: {
        userInfo: {},
        hasUserInfo: false,
        inputId: '1241890',
        inputUrl: 'https://item.jd.com/1241890.html'
    },
    onShow() {
        this.getUrl();
    },
    bindKeyInputId: function (e) {
        this.setData({
            inputId: e.detail.value
        });
    },
    bindKeyInputUrl: function (e) {
        this.setData({
            inputUrl: e.detail.value
        });
    },
    request(materialId) {
        var method = 'jd.union.open.promotion.bysubunionid.get';
        var app_key = '20ad31d6df275dfed0aa8246e7d420a4';
        var timestamp = this.getNowFormatDate();
        var format = 'json'
        var v = '1.0';
        var sign_method = 'md5';
        var param_json = JSON.stringify({ "promotionCodeReq": { "materialId": materialId } });
        var data = {
                'method': encodeURIComponent(method),
                'app_key': encodeURIComponent(app_key),
                'timestamp': encodeURIComponent(timestamp),
                'format': encodeURIComponent(format),
                'v': encodeURIComponent(v),
                'sign_method': encodeURIComponent(sign_method),
                'param_json': encodeURIComponent(param_json),
                'sign': encodeURIComponent(this.getSign(materialId))
            };
        var option = {'url': 'https://router.jd.com/api', 'query' : data};
        var url = this.setUrlQuery(option);
        console.log(url);
        swan.request({
            url: url,
            method: 'GET',
            success: res => {
                console.log(res);
                let result = res.data;
                if (result.jd_union_open_promotion_bysubunionid_get_response.code === '0') {
                    var obj = JSON.parse(result.jd_union_open_promotion_bysubunionid_get_response.result);
                    var path = obj.data.shortURL;
                    console.log(path);
                    swan.navigateToSmartProgram({
                        appKey: '4VvF29wlVg61mjRYCp4tY5dqkBgOyoYN', // 要打开的小程序 App Key
                        path: 'pages/proxy/union/union?spreadUrl=' + path, // 打开的页面路径，如果为空则打开首页
                        success: res => {
                            console.log('navigateToSmartProgram success', res);
                        },
                        fail: err => {
                            console.log('navigateToSmartProgram fail', err);
                        }
                        // });
                    });
                    swan.exit();
                }
            }
            ,
            fail: err => {
                swan.showToast({
                    title: JSON.stringify(err)
                });
                console.log('request fail', err);
            },
            complete: () => {
                this.setData('loading', false);
            }
        });

    },
    setUrlQuery(options) {
        let { url, query } = options;
        if (!url) return '';
        if (query) {
            let queryArr = [];
            for (const key in query) {
                if (query.hasOwnProperty(key)) {
                    queryArr.push(`${key}=${query[key]}`)
                }
            }
            if (url.indexOf('?') !== -1) {
                url = `${url}&${queryArr.join('&')}`
            } else {
                url = `${url}?${queryArr.join('&')}`
            }
        }
        return url;
    },
    getSign(materialId) {
        var method = 'jd.union.open.promotion.bysubunionid.get';
        var app_key = '20ad31d6df275dfed0aa8246e7d420a4';
        var timestamp = this.getNowFormatDate();
        var format = 'json'
        var v = '1.0';
        var sign_method = 'md5';
        var param_json = { "promotionCodeReq": { "materialId": materialId } };
        var app_secret = '8f731b52840b454e897d08acb2f2208d';

        var result = app_secret + 'app_key' + app_key +
            'format' + format +
            'method' + method +
            'param_json' + JSON.stringify(param_json) +
            'sign_method' + sign_method +
            'timestamp' + timestamp +
            'v' + v +
            app_secret;
        console.log(result + '\n');
        var sign = md5.hexMD5(result).toLocaleUpperCase();
        console.log(sign + '\n');
        return sign;
    },
    getNowFormatDate() {
        var nowDate = new Date();
        var colon = ":";
        var h = nowDate.getHours();
        var m = nowDate.getMinutes();
        var s = nowDate.getSeconds();
        //补全0，并拼接
        return this.getNowFormatDay(nowDate) + " " + this.completeDate(h) + colon + this.completeDate(m) + colon + this.completeDate(s);
    },
    completeDate(value) {
        return value < 10 ? "0" + value : value;
    },
    getNowFormatDay(nowDate) {
        var char = "-";
        if (nowDate == null) {
            nowDate = new Date();
        }
        var day = nowDate.getDate();
        var month = nowDate.getMonth() + 1;//注意月份需要+1
        var year = nowDate.getFullYear();
        //补全0，并拼接
        return year + char + this.completeDate(month) + char + this.completeDate(day);
    },
    getUrl(e) {
        var str = this.data.inputUrl + '';
        var i1 = str.lastIndexOf('/');
        var itemId = str.substr(i1 + 1 ,str.length);
        var i2 = itemId.lastIndexOf('.html');
        itemId = itemId.substring(0, i2);
        console.log(itemId);
        this.request('https://item.m.jd.com/product/' + itemId + '.html');
    },
    getId(e) {
        console.log(this.data.inputId);
        this.request('https://item.m.jd.com/product/' + this.data.inputId + '.html');
    }
})
