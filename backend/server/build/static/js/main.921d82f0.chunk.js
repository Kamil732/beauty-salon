(this.webpackJsonpfrontend=this.webpackJsonpfrontend||[]).push([[0],{61:function(e,t,n){},91:function(e,t,n){"use strict";n.r(t);var a=n(1),c=n.n(a),i=n(18),r=n.n(i),s=n(7),o=n(8),l=n(10),j=n(9),d=(n(61),n(62),n(11)),b=n.p+"static/media/logo.1309fc08.png",u=n(23),h=n(12),O=n.n(h),p=n(20),m=n(21),x=n.n(m),g="AUTH_LOADING",v="AUTH_SUCCESS",f="AUTH_ERROR",y="LOGIN_SUCCESS",k="LOGIN_FAIL",_="REGISTER_SUCCESS",N="REGISTER_FAIL",w="LOGOUT",z=n(25),C=n.n(z),S=n(19),T=function(e,t,n){return function(){var a=Object(p.a)(O.a.mark((function a(c){var i,r,s,o;return O.a.wrap((function(a){for(;;)switch(a.prev=a.next){case 0:return i=JSON.stringify({email:t,password:n,"g-recaptcha-response":e}),r={headers:{Accept:"application/json","Content-Type":"application/json","Accept-Language":"en","X-CSRFToken":C.a.get("csrftoken")}},a.prev=2,a.next=5,x.a.post("".concat("http://192.168.1.31:8000/api","/accounts/login/"),i,r);case 5:s=a.sent,c({type:y,payload:s.data.user}),S.NotificationManager.success(s.data.message,"Sukces",3e3),a.next=14;break;case 10:if(a.prev=10,a.t0=a.catch(2),a.t0.response)for(o in a.t0.response.data)S.NotificationManager.error(a.t0.response.data[o],"detail"===o?"B\u0142\u0105d":o,5e3);c({type:k});case 14:case"end":return a.stop()}}),a,null,[[2,10]])})));return function(e){return a.apply(this,arguments)}}()},A=n(2),I=function(e){Object(l.a)(n,e);var t=Object(j.a)(n);function n(){return Object(s.a)(this,n),t.apply(this,arguments)}return Object(o.a)(n,[{key:"render",value:function(){var e=this.props,t=e.loading,n=e.isAuthenticated,a=e.logout,c=e.closeNavigation;return Object(A.jsxs)(A.Fragment,{children:[Object(A.jsx)(d.c,{exact:!0,to:"/",className:"nav__link",onClick:c,children:"Home"}),Object(A.jsx)(d.c,{to:"/contact",className:"nav__link",onClick:c,children:"Kontakt"}),Object(A.jsx)(d.c,{to:"/gallery",className:"nav__link",onClick:c,children:"Galeria"}),t?null:n?Object(A.jsxs)(A.Fragment,{children:[Object(A.jsx)(d.c,{to:"/my-meetings",className:"nav__link",onClick:c,children:"Moje wizyty"}),Object(A.jsx)("button",{className:"btn",onClick:function(){c(),a()},children:"Wyloguj si\u0119"})]}):Object(A.jsx)(A.Fragment,{children:Object(A.jsx)(d.c,{to:"/login",className:"nav__link",onClick:c,children:"Zaloguj si\u0119"})})]})}}]),n}(a.Component),E={logout:function(){return function(){var e=Object(p.a)(O.a.mark((function e(t){var n,a,c,i;return O.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n={headers:{Accept:"application/json","Content-Type":"application/json","X-CSRFToken":C.a.get("csrftoken")}},a=JSON.stringify({withCredentials:!0}),e.prev=2,e.next=5,x.a.post("".concat("http://192.168.1.31:8000/api","/accounts/logout/"),a,n);case 5:c=e.sent,t({type:w}),S.NotificationManager.success(c.data.message,"Sukces",3e3),e.next=13;break;case 10:if(e.prev=10,e.t0=e.catch(2),e.t0.response)for(i in e.t0.response.data)S.NotificationManager.error(e.t0.response.data[i],"detail"===i?"B\u0142\u0105d":i,5e3);case 13:case"end":return e.stop()}}),e,null,[[2,10]])})));return function(t){return e.apply(this,arguments)}}()}},R=Object(u.b)((function(e){return{isAuthenticated:e.auth.isAuthenticated,loading:e.auth.loading}}),E)(I),B=function(e){Object(l.a)(n,e);var t=Object(j.a)(n);function n(){var e;Object(s.a)(this,n);for(var a=arguments.length,c=new Array(a),i=0;i<a;i++)c[i]=arguments[i];return(e=t.call.apply(t,[this].concat(c))).state={isNavActive:!1},e}return Object(o.a)(n,[{key:"render",value:function(){var e=this,t=this.state.isNavActive;return Object(A.jsxs)("div",{className:"header",children:[Object(A.jsxs)("div",{className:"mobile-nav",children:[Object(A.jsx)(d.b,{to:"/",children:Object(A.jsx)("img",{src:b,className:"header__logo",alt:"Damian Kwiecie\u0144"})}),Object(A.jsxs)("div",{className:"nav-btn",onClick:function(){return e.setState({isNavActive:!0})},children:[Object(A.jsx)("span",{className:"nav-btn__burger"}),"MENU"]})]}),t?Object(A.jsx)("div",{className:"nav-background",onClick:function(){return e.setState({isNavActive:!1})}}):null,Object(A.jsxs)("nav",{className:"nav".concat(t?" active":""),children:[Object(A.jsx)("span",{className:"btn-close d-md",onClick:function(){return e.setState({isNavActive:!1})}}),Object(A.jsx)(R,{closeNavigation:function(){return setTimeout((function(){return e.setState({isNavActive:!1})}),300)}})]})]})}}]),n}(a.Component),F=function(e){Object(l.a)(n,e);var t=Object(j.a)(n);function n(){return Object(s.a)(this,n),t.apply(this,arguments)}return Object(o.a)(n,[{key:"render",value:function(){return Object(A.jsx)("div",{className:"footer",children:"Copyright \xa9 2021"})}}]),n}(a.Component),L=n(6),M=n(29),U=n(24),G=n.p+"static/media/auth-illustration.e9633564.svg",D=function(e){Object(l.a)(n,e);var t=Object(j.a)(n);function n(){var e;Object(s.a)(this,n);for(var a=arguments.length,c=new Array(a),i=0;i<a;i++)c[i]=arguments[i];return(e=t.call.apply(t,[this].concat(c))).state={csrftoken:""},e.componentDidMount=Object(p.a)(O.a.mark((function t(){return O.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,x.a.get("".concat("http://192.168.1.31:8000/api","/accounts/csrf_cookie/"));case 3:e.setState({csrftoken:C.a.get("csrftoken")}),t.next=9;break;case 6:t.prev=6,t.t0=t.catch(0),console.error(t.t0);case 9:case"end":return t.stop()}}),t,null,[[0,6]])}))),e}return Object(o.a)(n,[{key:"render",value:function(){var e=this.state.csrftoken;return Object(A.jsx)("input",{type:"hidden",name:"csrfmiddlewaretoken",value:e})}}]),n}(a.Component);function q(e){var t=e.children;return Object(A.jsx)("div",{className:"card",children:t})}q.Body=function(e){var t=e.children;return Object(A.jsx)("div",{className:"card__body",children:t})};var Z=q,J=n(4),K=n(5),W=n.n(K);function H(e){var t=e.children;return Object(A.jsx)("div",{className:"form-control",children:t})}function X(e){var t=document.getElementById(e.htmlFor);return Object(A.jsx)("label",Object(J.a)({className:"form-control__label".concat((null===t||void 0===t?void 0:t.value)?" active":"")},e))}X.prototype.propTypes={htmlFor:W.a.string.isRequired},H.Label=X,H.Input=function(e){return Object(A.jsx)("input",Object(J.a)({className:"form-control__input"},e))};var P=H;function Y(e){return e.to?Object(A.jsx)(d.b,Object(J.a)(Object(J.a)({to:e.to,className:"btn".concat(e.primary?" btn__primary":"").concat(e.secondary?" btn__secondary":"").concat(e.loading?" btn__loading":"").concat(e.to?" btn__link":""),disabled:e.loading},e),{},{children:e.loading&&e.loadingText?e.loadingText:e.children})):Object(A.jsx)("button",Object(J.a)(Object(J.a)({className:"btn".concat(e.primary?" btn__primary":"").concat(e.secondary?" btn__secondary":"").concat(e.loading?" btn__loading":"").concat(e.to?" btn__link":""),disabled:e.loading},e),{},{children:e.loading&&e.loadingText?e.loadingText:e.children}))}Y.prototype.propTypes={loading:W.a.bool,primary:W.a.bool,secondary:W.a.bool,to:W.a.string};var Q=Y;function V(e){return Object(A.jsx)("div",Object(J.a)(Object(J.a)({className:"page-hero"},e),{},{children:e.children}))}function $(e){return Object(A.jsxs)("div",{className:"page-hero__img-container",children:[Object(A.jsx)("img",{src:e.src,alt:e.alt?e.alt:"",className:"page-hero__img"}),e.children]})}$.prototype.propTypes={src:W.a.string.isRequired,alt:W.a.string},V.Body=function(e){return Object(A.jsx)("div",Object(J.a)(Object(J.a)({className:"page-hero__body".concat(e.vertical?" vertical":"")},e),{},{children:e.children}))},V.Content=function(e){return Object(A.jsx)("div",Object(J.a)(Object(J.a)({className:"page-hero__content"},e),{},{children:e.children}))},V.Img=$,V.Title=function(e){return Object(A.jsx)("div",Object(J.a)(Object(J.a)({className:"page-hero__title"},e),{},{children:e.children}))},V.Text=function(e){return Object(A.jsx)("div",Object(J.a)(Object(J.a)({className:"page-hero__text"},e),{},{children:e.children}))};var ee=V,te=function(e){Object(l.a)(n,e);var t=Object(j.a)(n);function n(e){var a;return Object(s.a)(this,n),(a=t.call(this,e)).onChange=function(e){return a.setState(Object(M.a)({},e.target.name,e.target.value))},a.onSubmit=function(e){e.preventDefault(),a.setState({loading:!0}),a.props.login("xd",a.state.email,a.state.password),a.setState({loading:!1})},a.state={loading:!1,email:"",password:""},a.onChange=a.onChange.bind(Object(U.a)(a)),a.onSubmit=a.onSubmit.bind(Object(U.a)(a)),a}return Object(o.a)(n,[{key:"render",value:function(){var e=this.state,t=e.loading,n=e.email,a=e.password;return this.props.isAuthenticated?Object(A.jsx)(L.a,{to:"/"}):Object(A.jsx)(ee,{children:Object(A.jsxs)(ee.Body,{children:[Object(A.jsx)(ee.Img,{src:G,children:Object(A.jsxs)("p",{className:"text-broken",children:["Nie masz jeszcze konta? Kliknij"," ",Object(A.jsx)(d.b,{to:"/contact",className:"slide-floor",children:"tutaj"})," ","by si\u0119 skontaktowa\u0107 w sprawie z kontem"]})}),Object(A.jsxs)(ee.Content,{children:[Object(A.jsx)(ee.Title,{children:"Zaloguj si\u0119"}),Object(A.jsx)(Z,{children:Object(A.jsx)(Z.Body,{children:Object(A.jsxs)("form",{onSubmit:this.onSubmit,children:[Object(A.jsx)(D,{}),Object(A.jsxs)(P,{children:[Object(A.jsx)(P.Label,{htmlFor:"email",children:"Email:"}),Object(A.jsx)(P.Input,{required:!0,type:"email",id:"email",name:"email",onChange:this.onChange,value:n})]}),Object(A.jsxs)(P,{children:[Object(A.jsx)(P.Label,{htmlFor:"password",children:"Has\u0142o:"}),Object(A.jsx)(P.Input,{required:!0,type:"password",id:"password",name:"password",onChange:this.onChange,value:a,min:"3"})]}),Object(A.jsx)(Q,{primary:!0,loading:t,loadingText:"Logowanie",children:"Zaloguj si\u0119"})]})})})]})]})})}}]),n}(a.Component),ne={login:T},ae=Object(u.b)((function(e){return{isAuthenticated:e.auth.isAuthenticated}}),ne)(te),ce=n(50),ie=n(51),re=n.p+"static/media/contact-illustration.2b23aa39.svg",se=function(e){Object(l.a)(n,e);var t=Object(j.a)(n);function n(){return Object(s.a)(this,n),t.apply(this,arguments)}return Object(o.a)(n,[{key:"render",value:function(){return Object(A.jsxs)(ee,{children:[Object(A.jsxs)(ee.Body,{children:[Object(A.jsx)(ee.Img,{src:re}),Object(A.jsxs)(ee.Content,{children:[Object(A.jsx)(ee.Title,{children:"Skontaktuj si\u0119 z nami"}),Object(A.jsx)(ee.Text,{children:"Je\u015bli chcesz dowiedzi\u0107 si\u0119 wi\u0119cej na temat naszego salonu fryzjerskiego lub um\xf3wi\u0107 swoj\u0105 pierwsz\u0105 wizyt\u0119, mo\u017cesz zadzwonic na poni\u017cszy numer telefonu."}),Object(A.jsxs)("a",{href:"tel:+48-505-946-545",className:"unique-text icon-container",children:[Object(A.jsx)(ce.a,{className:"icon-container__icon"}),"+48 505 946 545"]}),Object(A.jsx)(ee.Text,{children:"Stali klienci maj\u0105 opcj\u0119 komunikatora tekstowego, s\u0105 r\xf3wnie\u017c przez niego powiadamiani o nadchodz\u0105cej wizycie"})]})]}),Object(A.jsxs)(ee.Body,{children:[Object(A.jsxs)(ee.Content,{children:[Object(A.jsx)(ee.Title,{children:Object(A.jsxs)("div",{className:"icon-container",children:[Object(A.jsx)(ie.a,{className:"icon-container__icon"}),"Lokalizacja"]})}),Object(A.jsx)(ee.Text,{children:"Nasz salon fryzjerski znajdziesz pod adresem:"}),Object(A.jsx)("span",{className:"unique-text",style:{width:"100%"},children:"Stefana \u017beromskiego 60, 26-680 Wierzbica"})]}),Object(A.jsx)("div",{style:{textAlign:"center"},children:Object(A.jsx)("iframe",{title:"map",src:"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d371.25592612718344!2d21.070607758719838!3d51.246661846651435!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x471843ae043f723d%3A0x822ca4d3514898!2sSALON%20FRYZJERSKI%20DAMIAN%20KWIECIE%C5%83!5e0!3m2!1spl!2spl!4v1617379006232!5m2!1spl!2spl",height:"300",allowfullscreen:"",loading:"lazy"})})]})]})}}]),n}(a.Component),oe=Object(u.b)((function(e){return{isAuthenticated:e.auth.isAuthenticated}}),null)(se),le=n(36),je=n(52),de=n.p+"static/media/gallery-illustration.8b0b3b98.svg",be=n(55);var ue=function(){return Object(A.jsxs)("div",{class:"brick-loader",children:[Object(A.jsx)("div",{class:"brick-loader__brick brick1"}),Object(A.jsx)("div",{class:"brick-loader__brick brick2"}),Object(A.jsx)("div",{class:"brick-loader__brick brick3"}),Object(A.jsx)("div",{class:"brick-loader__brick brick4"}),Object(A.jsx)("div",{class:"brick-loader__brick brick5"}),Object(A.jsx)("div",{class:"brick-loader__brick brick6"}),Object(A.jsx)("div",{class:"brick-loader__brick brick7"}),Object(A.jsx)("div",{class:"brick-loader__brick brick8"}),Object(A.jsx)("div",{class:"brick-loader__brick brick9"})]})};var he=function(e){var t=e.loading,n=e.images,c=Object(a.useState)(null),i=Object(be.a)(c,2),r=i[0],s=i[1];return Object(a.useEffect)((function(){document.querySelector("body").style.overflowY=null===r?"auto":"hidden"}),[r]),n.length>0?(n=n.map((function(e){return Object(A.jsxs)(A.Fragment,{children:[Object(A.jsxs)("figure",{className:"gallery__img-container".concat(r===e.id?" zoom":""),children:[r===e.id?Object(A.jsx)("span",{className:"btn-close",onClick:function(){return s(null)}}):null,Object(A.jsx)("img",{src:e.image,alt:e.title,className:"gallery__img".concat(r===e.id?" zoom":""),onClick:function(){return s(e.id)}}),r===e.id?Object(A.jsx)("p",{className:"gallery__img__title",children:e.title}):null]}),r===e.id?Object(A.jsx)("figure",{className:"gallery__img-container"}):null]})})),Object(A.jsxs)(A.Fragment,{children:[Object(A.jsx)("div",{className:"gallery",children:n}),t?Object(A.jsx)(ue,{}):null]})):t?Object(A.jsx)(ue,{}):Object(A.jsx)("h2",{children:"Galeria jest pusta. Nie ma \u017cadnych zdj\u0119\u0107"})},Oe=function(e){Object(l.a)(n,e);var t=Object(j.a)(n);function n(e){var a;return Object(s.a)(this,n),(a=t.call(this,e)).componentDidMount=function(){return a.getImages()},a.getImages=Object(p.a)(O.a.mark((function e(){var t,n,c=arguments;return O.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=c.length>0&&void 0!==c[0]?c[0]:1,a.setState({loading:!0}),e.prev=2,e.next=5,x.a.get("".concat("http://192.168.1.31:8000/api","/accounts/gallery/?page=").concat(t));case 5:n=e.sent,a.setState({loading:!1,data:{next:n.data.next,results:[].concat(Object(le.a)(a.state.data.results),Object(le.a)(n.data.results))}}),e.next=13;break;case 9:e.prev=9,e.t0=e.catch(2),S.NotificationManager.error("Nie uda\u0142o si\u0119 za\u0142adowa\u0107 zdj\u0119\u0107","B\u0142\u0105d",1e4),a.setState({loading:!1});case 13:case"end":return e.stop()}}),e,null,[[2,9]])}))),a.state={loading:!0,data:{next:null,results:[]}},a.getImages=a.getImages.bind(Object(U.a)(a)),a}return Object(o.a)(n,[{key:"render",value:function(){var e=this,t=this.state,n=t.loading,a=t.data;return Object(A.jsxs)(ee,{children:[Object(A.jsxs)(ee.Body,{children:[Object(A.jsx)(ee.Img,{src:de}),Object(A.jsxs)(ee.Content,{children:[Object(A.jsx)(ee.Title,{children:"Galeria zdj\u0119\u0107"}),Object(A.jsx)(ee.Text,{children:"Ze zgod\u0105 naszych klient\xf3w zrobili\u015bmy im par\u0119 zdj\u0119\u0107, by\u015b Ty m\xf3g\u0142 zdecydowa\u0107 nad swoj\u0105 przysz\u0142a fryzur\u0105"})]})]}),Object(A.jsx)(ee.Body,{children:Object(A.jsxs)("div",{children:[Object(A.jsx)(ee.Title,{style:{textAlign:"center"},children:Object(A.jsxs)("div",{className:"icon-container",children:[Object(A.jsx)(je.a,{className:"icon-container__icon"}),"Zdj\u0119cia klient\xf3w"]})}),Object(A.jsx)(he,{images:a.results,loading:n}),a.next?Object(A.jsx)(Q,{secondary:!0,onClick:function(){return e.getImages(a.next)},style:{marginLeft:"auto",marginRight:"auto",marginTop:"5rem"},children:"Za\u0142aduj Wi\u0119cej"}):null]})})]})}}]),n}(a.Component),pe=n.p+"static/media/barber-illustration.c0ef8a86.svg";var me=function(e){var t=e.children;return Object(A.jsx)("div",{className:"btn-container",children:t})};var xe=function(){return Object(A.jsx)(ee,{children:Object(A.jsxs)(ee.Body,{children:[Object(A.jsxs)(ee.Content,{children:[Object(A.jsx)(ee.Title,{children:"Pe\u0142na obs\u0142uga m\u0119\u017cczyzn i ch\u0142opc\xf3w"}),Object(A.jsx)(ee.Text,{children:"Wolno\u015b\u0107 w podejmowaniu decyzji, elastyczno\u015b\u0107 w wykorzystaniu czasu. Prze\u017cyj czas, kiedy dbanie o w\u0142osy i brod\u0119 by\u0142o m\u0119skie i by\u0142o cz\u0119\u015bci\u0105 bycia m\u0119\u017cczyzn\u0105"}),Object(A.jsxs)(me,{children:[Object(A.jsx)(Q,{primary:!0,to:"/my-meetings",children:"Um\xf3w wizyt\u0119"}),Object(A.jsx)(Q,{secondary:!0,to:"/contact",children:"Kontakt"})]})]}),Object(A.jsx)(ee.Img,{src:pe})]})})},ge=n.p+"static/media/error-404-illustration.4861ae77.svg";var ve=function(){return Object(A.jsx)(ee,{children:Object(A.jsxs)(ee.Body,{vertical:!0,children:[Object(A.jsx)(ee.Img,{src:ge}),Object(A.jsx)(ee.Text,{children:"Nie ma takiej strony. U\u017cyj nawigacji na g\xf3rze strony by dosta\u0107 si\u0119 tam gdzie chcesz."})]})})},fe=function(e){Object(l.a)(n,e);var t=Object(j.a)(n);function n(){return Object(s.a)(this,n),t.apply(this,arguments)}return Object(o.a)(n,[{key:"render",value:function(){return Object(A.jsxs)(L.d,{children:[Object(A.jsx)(L.b,{exact:!0,path:"/",component:xe}),Object(A.jsx)(L.b,{exact:!0,path:"/gallery",component:Oe}),Object(A.jsx)(L.b,{exact:!0,path:"/contact",component:oe}),Object(A.jsx)(L.b,{exact:!0,path:"/login",component:ae}),Object(A.jsx)(L.b,{path:"*",component:ve})]})}}]),n}(a.Component),ye=n(22),ke=n(53),_e=n(54),Ne={isAuthenticated:null,loading:null,data:{}},we=Object(ye.combineReducers)({auth:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:Ne,t=arguments.length>1?arguments[1]:void 0;switch(t.type){case g:return Object(J.a)(Object(J.a)({},e),{},{loading:!0});case v:case y:case _:return Object(J.a)(Object(J.a)({},e),{},{isAuthenticated:!0,loading:!1,data:t.payload});case f:case N:case k:case w:return Object(J.a)(Object(J.a)({},e),{},{isAuthenticated:!1,loading:!1,data:Ne.data});default:return e}}}),ze=[_e.a],Ce=Object(ye.createStore)(we,{},Object(ke.composeWithDevTools)(ye.applyMiddleware.apply(void 0,ze))),Se=function(e){Object(l.a)(n,e);var t=Object(j.a)(n);function n(){return Object(s.a)(this,n),t.apply(this,arguments)}return Object(o.a)(n,[{key:"componentDidMount",value:function(){Ce.dispatch(function(){var e=Object(p.a)(O.a.mark((function e(t){var n,a;return O.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t({type:g}),n={headers:{Accept:"application/json","Content-Type":"application/json","Accept-Language":"en","X-CSRFToken":C.a.get("csrftoken")}},e.prev=2,e.next=5,x.a.get("".concat("http://192.168.1.31:8000/api","/accounts/current/"),n);case 5:a=e.sent,t({type:v,payload:a.data}),e.next=12;break;case 9:e.prev=9,e.t0=e.catch(2),t({type:f});case 12:case"end":return e.stop()}}),e,null,[[2,9]])})));return function(t){return e.apply(this,arguments)}}())}},{key:"render",value:function(){return Object(A.jsx)(u.a,{store:Ce,children:Object(A.jsxs)(d.a,{children:[Object(A.jsx)(B,{}),Object(A.jsxs)("div",{className:"content-wrap",children:[Object(A.jsx)(S.NotificationContainer,{}),Object(A.jsx)(fe,{})]}),Object(A.jsx)(F,{})]})})}}]),n}(a.Component);r.a.render(Object(A.jsx)(c.a.StrictMode,{children:Object(A.jsx)(Se,{})}),document.getElementById("root"))}},[[91,1,2]]]);
//# sourceMappingURL=main.921d82f0.chunk.js.map