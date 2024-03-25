import styled from "styled-components";
import bg from "@images/load/bg.jpg";
import land from "@images/load/land.png";
import add from "@images/load/add.png";
import title from "@images/load/title.png";
import bottom from "@images/load/bottom.png";
import footer from "@images/load/footer.png";

const bgW = "750px";
const bgH = "750px";

const titleW = "393px";
const titleH = "127px";

const footerW = "280px";
const footerH = "118px";

const bottomW = "162px";
const bottomH = "16px";

const enterW = "122px";
const enterH = "52px";

export const LoadWrapper = styled.div`
    width: 100%;
    height: 100%;

    background-color: #ffe8ad;

    .fg {
        background-color: #ffffff;
        width: 100%;
        height: 100%;
        opacity: 0;
        pointer-events: none;
    }

    .bg {
        width: 100%;
        height: 100%;
        background-image: url(${bg});
        background-size: 100% 100%;
        background-repeat: no-repeat;
    }

    &.mobile {
        .land {
            width: 100%;
            height: 100%;
            background-image: url(${land});
            background-size: 100%;
            background-repeat: no-repeat;
            background-position-y: 100%;
            @media (orientation: landscape) {
                display: none;
            }
        }

        .add {
            width: 100%;
            height: 100%;
            background-size: 100% 100%;
            background-image: url(${add});
            mix-blend-mode: overlay;
        }
    }

    &.pc {
        .land,
        .add {
            display: none;
        }
    }

    .title {
        --scale: 0.52;
        background: url(${title});
        width: calc(${titleW} * var(--scale));
        height: calc(${titleH} * var(--scale));
        left: calc(50% - ${titleW} * var(--scale) * 0.5);
        top: calc(20% - ${titleH} * var(--scale) * 0.5);
        background-size: 100%;
    }

    .footer {
        --scale: 0.56;
        background: url(${footer});
        width: calc(${footerW} * var(--scale));
        height: calc(${footerH} * var(--scale));
        left: calc(50% - ${footerW} * var(--scale) * 0.5);
        bottom: 50px;
        background-size: 100%;
    }
`;

export const EnterButtonWrapper = styled.div`
    --scale: 0.8;
    top: calc((100% - ${enterH} * var(--scale)) * 0.5);
    left: calc((100% - ${enterW} * var(--scale)) * 0.5);
    width: calc(${enterW} * var(--scale));
    height: calc(${enterH} * var(--scale));
    svg {
        .outer {
            fill-rule: evenodd;
            clip-rule: evenodd;
            fill: none;
            stroke: #de9153;
            stroke-width: 0.6px;
            stroke-linecap: round;
            stroke-linejoin: round;
            stroke-miterlimit: 10;
        }

        .outer-stroke {
            fill-rule: evenodd;
            clip-rule: evenodd;
            fill: none;
            stroke: #de9153;
            stroke-width: 1px;
            stroke-linecap: round;
            stroke-linejoin: round;
            stroke-miterlimit: 10;
        }

        .text {
            fill-rule: evenodd;
            clip-rule: evenodd;
            stroke-width: 0.5px;
        }
    }

    &.can-enter {
        animation: scaleAni 0.7s ease-in 0s infinite alternate;
        -webkit-animation: scaleAni 0.7s ease-in 0s infinite alternate;
    }

    @keyframes scaleAni {
        0% {
            transform: scale(1);
        }

        100% {
            transform: scale(0.92);
        }
    }
`;
