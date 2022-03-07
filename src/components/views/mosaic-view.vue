<template>
  <div id="media-container" ref="mosaicView">
    <div v-if="processedMedia">
      <div v-for="media in processedMedia" :key="media.filename">
        <v-hover
          v-slot="hoverProps"
          :model-value="isMediaSelected(media.uuid) ? true : undefined"
        >
          <v-card
            v-bind="hoverProps.props"
            :style="{
              width: `${media.computedWidth}px`,
              height: `${media.computedHeight}px`,
            }"
            class="modal"
            @click="mediaClick(media)"
          >
            <ImageWrapper
              :media="media"
              :album-share-link-auth="props.albumShareLinkAuth"
            />
            <!-- TODO: remove scroll-strategy prop in the future, because it might default to reposition -->
            <!-- TODO: width and height might not be needed in the future too -->
            <v-overlay
              :model-value="hoverProps.isHovering"
              contained
              width="100%"
              height="100%"
              scroll-strategy="reposition"
              scrim="black"
              class="align-center justify-center"
            >
              <v-btn
                icon
                color="white"
                position="absolute"
                top="1vh"
                left="1vh"
                variant="text"
                @click.stop="
                  isMediaSelected(media.uuid)
                    ? emit('unselectMedia', media)
                    : emit('selectMedia', media)
                "
              >
                <v-icon v-if="isMediaSelected(media.uuid)">
                  mdi-check-circle
                </v-icon>
                <v-icon v-else> mdi-checkbox-blank-circle-outline </v-icon>
              </v-btn>
              <LikeButton
                :media="media"
                color="white"
                style="position: absolute; bottom: 1vh; left: 1vh"
              />
            </v-overlay>
          </v-card>
        </v-hover>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { MediaResponse } from "@galera/client-axios";
import { defineComponent, onMounted, PropType, Ref, ref } from "vue";

import LikeButton from "~/components/buttons/like-button.vue";
import ImageWrapper from "~/components/media/image-wrapper.vue";
import { AlbumShareLinkScheme } from "~/composables/api";
import { useSelectedMediaStore } from "~/stores/selected-media";

// TODO: use only script setup when this issue is solved:
// https://github.com/import-js/eslint-plugin-import/issues/2243
export default defineComponent({
  name: "MosaicView",
});
</script>

<script setup lang="ts">
const props = defineProps({
  mediaList: {
    type: Object as PropType<MediaResponse[]>,
    required: true,
  },
  selectedMedia: {
    type: Object as PropType<MediaResponse[]>,
    required: true,
  },
  albumShareLinkAuth: {
    type: Object as PropType<AlbumShareLinkScheme>,
    default: undefined,
  },
});

const emit = defineEmits(["selectMedia", "unselectMedia"]);

const setMediaModal = useSelectedMediaStore().setMediaModal;

// TODO: deduplicate
function isMediaSelected(mediaUuid: string): boolean {
  return props.selectedMedia.some((media) => media.uuid == mediaUuid) ?? false;
}

// TODO: deduplicate
function isSomethingSelected(): boolean {
  return props.selectedMedia.length > 0;
}

// TODO: deduplicate
function mediaClick(media: MediaResponse) {
  if (isSomethingSelected()) {
    isMediaSelected(media.uuid)
      ? emit("unselectMedia", media)
      : emit("selectMedia", media);

    return;
  }

  setMediaModal(media);
}

const spaceBetweenImages = 8;

function getMinNumberOfCols(width: number | undefined): number | undefined {
  if (!width) {
    return;
  }

  if (width <= 640) {
    return 2;
  } else if (width <= 1280) {
    return 4;
  } else if (width <= 1920) {
    return 5;
  }
  return 6;
}

function computeRow(
  imgs: MediaResponse[],
  offset: number,
  rowCount: number,
  containerWidth: number
): ProcessedMedia[] {
  const rowImgs = imgs.slice(offset, offset + rowCount);
  const firstRowImageWidth = rowImgs[0].width;
  const firstRowImageHeight = rowImgs[0].height;
  const processedMedia: ProcessedMedia[] = [];

  let firstImageAspectRatio = firstRowImageWidth;
  for (let i = 1; i < rowImgs.length; i++) {
    firstImageAspectRatio +=
      rowImgs[i].width * (firstRowImageHeight / rowImgs[i].height);
  }

  firstImageAspectRatio =
    (containerWidth - spaceBetweenImages * (rowCount - 0.5)) /
    firstImageAspectRatio;
  const firstRowImgHeight = firstImageAspectRatio * firstRowImageHeight;

  for (const [index, media] of rowImgs.entries()) {
    const imageAspectRatio = firstRowImgHeight / media.height;

    const computedWidth =
      index > 0
        ? imageAspectRatio * media.width
        : firstImageAspectRatio * firstRowImageWidth;
    const computedHeight =
      index > 0 ? imageAspectRatio * media.height : firstRowImgHeight;

    processedMedia.push({
      computedWidth,
      computedHeight,
      ...media,
    });
  }

  return processedMedia;
}

function computeAllRows(
  mediaList: MediaResponse[],
  numberOfCols: number,
  containerWidth: number
): ProcessedMedia[] {
  let processedMedia: ProcessedMedia[] = [];
  for (let index = 0; index < props.mediaList.length / numberOfCols; index++) {
    processedMedia.push(
      ...computeRow(
        mediaList,
        numberOfCols * index,
        numberOfCols,
        containerWidth
      )
    );
  }

  // TODO: consider throttling the ResizeObserver
  console.error("computed");
  return processedMedia;
}

interface ProcessedMedia extends MediaResponse {
  computedWidth: number;
  computedHeight: number;
}

const processedMedia: Ref<ProcessedMedia[] | undefined> = ref();

const mosaicView: Ref<HTMLDivElement | undefined> = ref();

onMounted(() => {
  const numberOfCols = getMinNumberOfCols(mosaicView.value?.clientWidth);
  if (mosaicView.value && numberOfCols) {
    processedMedia.value = computeAllRows(
      props.mediaList,
      numberOfCols,
      mosaicView.value.clientWidth
    );

    new ResizeObserver(() => {
      const numberOfCols = getMinNumberOfCols(mosaicView.value?.clientWidth);
      if (!numberOfCols || numberOfCols == 0 || !mosaicView.value) {
        return;
      }

      processedMedia.value = computeAllRows(
        props.mediaList,
        numberOfCols,
        mosaicView.value.clientWidth
      );
    }).observe(mosaicView.value);
  }
});
</script>

<style scoped>
#media-container {
  position: relative;
  width: 100%;
  height: 100%;
}

#media-container > div {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
