<template>
    <div class="infoblob-container">
        <div class="infoblob-i">i</div>
        <div class="infoblob-text-container">
            <slot />
            <!-- <span>
                Zuerst werden die Terme umsortiert, sodass sich absorbierende Terme leichter auffallen.
            </span> -->
        </div>
    </div>
</template>

<script>
export default {

};
</script>

<style scoped lang="scss">

$infoblob-border-radius: 5px;

.infoblob-container {
    position: relative;
    text-align: center;
    // float: left;

    /* Makes i unselectable */
    -webkit-user-select: none; /* Safari */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* IE10+/Edge */
    user-select: none; /* Standard */

    cursor: pointer;

    background-color: #2196f3;
    display: inline-block;

    width: 17px;
    font-size: 16px;
    border-width: 1px;
    border-radius: $infoblob-border-radius;
    border-style: solid;

    border-color: white;
    color: white;
}

.infoblob-container:hover {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;

    background-color: rgba(#2196f3, 0.5);
    .infoblob-text-container {
        // visibility: visible;
        display: block;
    }
}

.infoblob-text-container {
    // visibility: hidden;
    display: none;
    z-index: 1;
    position: absolute;
    background-color: white;
    color: black;

    // top: 69%;
    // left: 69%;
    top: 0;
    left: 100%;
    // margin-left: -50%;
    // margin-right: -50%;
    // transform: translateX(-50%);

    width: 300px;
    padding: .4em;
    border-style: solid;
    border-color: black;
    border-width: 1px;
    border-radius: .3em;
    border-top-left-radius: 0;

    white-space: normal;
}

@media screen and (max-width: 800px) {
    .infoblob-text-container {
        // show InfoBlob full screen on small devices
        position: fixed;
        top: 15%;
        left: 20%;
        width: 59%;
        z-index: 3;
    }
    .infoblob-container {
        // just visual tweaks
        border-radius: $infoblob-border-radius !important;
    }
}
</style>
