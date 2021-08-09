<template>
  <section>
    <div>
      <div>
        <article>
          <table>
            <thead>
              <slot name="header"></slot>
            </thead>
            <tbody>
              <slot name="body"></slot>
            </tbody>
          </table>
        </article>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
  section {
    @apply flex flex-col;
    & > div {
      @apply -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8;
      & > div {
        @apply py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8;
        & > article {
          @apply shadow overflow-hidden border-b border-second-200 sm:rounded-lg;
        }
      }
    }
  }
  table {
    @apply min-w-full divide-y divide-second-200;
    thead {
      @apply bg-second-50;
    }
  }
</style>
