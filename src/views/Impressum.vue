<template>
  <div class="about">
    <h2>{{$t('herausgeber')}}</h2>
    <p><font-awesome-icon icon="user-friends"/> Marcel Brand, Christian Heidorn, Jan Spieck, Michael Witterauf</p>
    <p><font-awesome-icon icon="road"/> Cauerstraße 11</p>
    <p><font-awesome-icon icon="university"/> 91058 Erlangen</p>
    <p><font-awesome-icon icon="envelope"/> <a>cs12-gti@fau.de</a></p>

    <h2>{{$t('representedByHeader')}}</h2>
    <p>{{$t('representedBy')}}</p>

    <h2>{{$t('contactPersonHeader')}}</h2>
    <p><font-awesome-icon icon="user-friends"/> Marcel Brand, Christian Heidorn, Jan Spieck, Michael Witterauf</p>
    <p><font-awesome-icon icon="envelope"/> <a>cs12-gti@fau.de</a></p>

    <h2>{{$t('haftungsauschlussHeader')}}</h2>
    <p>{{$t('haftungsauschlussBody')}}</p>
  </div>
</template>

<style>
  .about {
    width: 1000px;
    margin: auto;
    text-align: left;
    background: #ffffff8a;
  }
</style>
