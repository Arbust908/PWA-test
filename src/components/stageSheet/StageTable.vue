<template>
  <form method="POST" action="/" class="p-4 flex flex-col gap-4">
    <div class="flex flex-col">
      <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div class="overflow-hidden">
            <table class="min-w-full divide-y divide-gray-200">
              <thead>
                <slot name="head"> Head </slot>
              </thead>
              <tbody class="divide-y">
                <slot name="body"> Body </slot>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </form>
</template>
