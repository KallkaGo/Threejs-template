import styled from "styled-components";
import logo from "@images/game/logo.png";
import tap from "@images/game/tap.png";
import info from "@images/game/info.png";
import share from "@images/game/share.png";
// import audio from "@images/game/au.png";
import audio_on from "@images/game/au-on.png";
import audio_off from "@images/game/au-off.png";
import gallery from "@images/game/gallery.png";
import replay from "@images/game/replay.png";

const btnW = `70px`;
const btnH = `70px`;

const logoW = `166px`;
const logoH = `98px`;

const tapW = `185px`;
const tapH = `133px`;

const endingBtnW = `247px`;
const endingBtnH = `81px`;

export const GameWrapper = styled.div`
    div {
        background-size: 100% !important;
        background-repeat: no-repeat !important;
    }

    --scale: 0.53;
    .logo {
        background-image: url(${logo});
        width: calc(${logoW} * 0.8);
        height: calc(${logoH} * 0.8);
        left: 15px;
        top: 35px;
        transform-origin: top left;
        transform: scale(0.65);
    }

    .tap {
        background-image: url(${tap});
        width: calc(${tapW} * var(--scale));
        height: calc(${tapH} * var(--scale));
        left: calc(50% - ${tapW} * var(--scale) * 0.5);
        top: calc(70% + ${tapH} * var(--scale) * 0.5);
    }

    .menu {
        right: 10px;
        top: 30px;
        width: calc(${btnW} * var(--scale));
        height: 200px;

        .btn {
            width: calc(${btnW} * var(--scale));
            height: calc(${btnH} * var(--scale));

            &:nth-child(1) {
                top: 0px;
            }

            &:nth-child(2) {
                top: 40px;
            }

            &:nth-child(3) {
                top: 80px;
            }
        }

        .info {
            background-image: url(${info});
        }

        .share {
            background-image: url(${share});
        }

        .audio {
            background-image: url(${audio_on});
            animation: rotate 5s linear 0s infinite;
            -webkit-animation: rotate 5s linear 0s infinite;

            @keyframes rotate {
                0% {
                    transform: rotate(0deg);
                }

                100% {
                    transform: rotate(360deg);
                }
            }
            &.mute {
                background-image: url(${audio_off});
                /* background-position-x: calc(0px - ${btnW} * var(--scale)); */
                transform: rotate(0deg) !important;
                animation: none;
                -webkit-animation: none;
            }
        }
    }

    .ending {
        left: 50%;
        top: 66%;
        animation: show-ani 0.6s linear 0s 1;
        -webkit-animation: show-ani 0.6s linear 0s 1;
        @keyframes show-ani {
            0% {
                opacity: 0;
            }

            100% {
                opacity: 1;
            }
        }
        filter: drop-shadow(0px 0px 3px #ffb73abb);
        .btn {
            width: calc(${endingBtnW} * var(--scale));
            height: calc(${endingBtnH} * var(--scale));
            transform: translateX(-50%);
        }
        .glow {
            filter: drop-shadow(0px 0px 3px #ffb73abb);
        }
        .gallery {
            background-image: url(${gallery});
        }
        .replay {
            background-image: url(${replay});
            top: 62px;
        }
    }
`;
