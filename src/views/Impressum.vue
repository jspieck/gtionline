<template>
  <div class="about pageContainer">
    <h3 class="title">Impressum</h3>
    <div class="bodyContainer">
      <h2>{{$t('herausgeber')}}</h2>
      <p><span class="icon"><font-awesome-icon icon="user-friends"/></span> <span class="info">Marcel Brand, Christian Heidorn, Jan Spieck, Michael Witterauf</span></p>
      <p><span class="icon"><font-awesome-icon icon="road"/></span> <span class="info">Cauerstraße 11</span></p>
      <p><span class="icon"><font-awesome-icon icon="university"/></span> <span class="info">91058 Erlangen</span></p>
      <p><span class="icon"><font-awesome-icon icon="envelope"/></span> <span class="info"><a>cs12-gti@fau.de</a></span></p>

      <h2>{{$t('representedByHeader')}}</h2>
      <p class="info">{{$t('representedBy')}}</p>

      <h2>{{$t('contactPersonHeader')}}</h2>
      <p><span class="icon"><font-awesome-icon icon="user-friends"/></span> <span class="info">Marcel Brand, Christian Heidorn, Jan Spieck, Michael Witterauf</span></p>
      <p><span class="icon"><font-awesome-icon icon="envelope"/></span> <span class="info"><a>cs12-gti@fau.de</a></span></p>

      <h2>{{$t('haftungsauschlussHeader')}}</h2>
      <p class="info">{{$t('haftungsauschlussBody')}}</p>
    </div>
  </div>
</template>

<style>
  .title {
    text-align: center;
  }
  .about {
    text-align: left !important;
  }
  .info {
    font-size: 18px;
  }
  .icon {
    display: inline-block;
    width: 20px;
    margin-right: 10px;
    color: #0d336f;
  }
</style>
