<template>
  <div style="height: 100vh" class="overflow-hidden">
    <div class="container-fluid">
      <div class="row">
        <div class="col-3 pt-3 bg-body-tertiary">
          <todo-list-sidebar />
        </div>
        <div class="col-9">
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>
