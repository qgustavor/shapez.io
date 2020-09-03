import { enumDirection, Vector } from "../../core/vector";
import { ItemAcceptorComponent } from "../components/item_acceptor";
import { ItemEjectorComponent } from "../components/item_ejector";
import {
    enumItemProcessorRequirements,
    enumItemProcessorTypes,
    ItemProcessorComponent,
} from "../components/item_processor";
import { enumPinSlotType, WiredPinsComponent } from "../components/wired_pins";
import { Entity } from "../entity";
import { defaultBuildingVariant, MetaBuilding } from "../meta_building";
import { GameRoot } from "../root";

/** @enum {string} */
export const enumFilterVariants = { mirrored: "mirrored" };

export class MetaFilterBuilding extends MetaBuilding {
    constructor() {
        super("filter");
    }

    getSilhouetteColor() {
        return "#c45c2e";
    }

    /**
     * @param {GameRoot} root
     */
    getAvailableVariants(root) {
        return [defaultBuildingVariant, enumFilterVariants.mirrored];
    }

    /**
     * @param {GameRoot} root
     */
    getIsUnlocked(root) {
        // @todo
        return true;
    }

    getDimensions() {
        return new Vector(2, 1);
    }

    getShowWiresLayerPreview() {
        return true;
    }

    /**
     * Creates the entity at the given location
     * @param {Entity} entity
     */
    setupEntityComponents(entity) {
        entity.addComponent(
            new WiredPinsComponent({
                slots: [
                    {
                        pos: new Vector(0, 0),
                        direction: enumDirection.left,
                        type: enumPinSlotType.logicalAcceptor,
                    },
                ],
            })
        );

        entity.addComponent(
            new ItemAcceptorComponent({
                slots: [
                    {
                        pos: new Vector(0, 0),
                        directions: [enumDirection.bottom],
                    },
                ],
            })
        );

        entity.addComponent(
            new ItemEjectorComponent({
                slots: [
                    {
                        pos: new Vector(0, 0),
                        direction: enumDirection.top,
                    },
                    {
                        pos: new Vector(1, 0),
                        direction: enumDirection.right,
                    },
                ],
            })
        );

        entity.addComponent(
            new ItemProcessorComponent({
                processorType: enumItemProcessorTypes.filter,
                inputsPerCharge: 1,
                processingRequirement: enumItemProcessorRequirements.filter,
            })
        );
    }

    /**
     *
     * @param {Entity} entity
     * @param {number} rotationVariant
     * @param {string} variant
     */
    updateVariants(entity, rotationVariant, variant) {
        switch (variant) {
            case defaultBuildingVariant:
            case enumFilterVariants.mirrored: {
                // REGULAR FILTER

                entity.components.ItemAcceptor.setSlots([
                    {
                        pos: new Vector(0, 0),
                        directions: [
                            variant === defaultBuildingVariant ? enumDirection.bottom : enumDirection.top,
                        ],
                    },
                ]);

                entity.components.ItemEjector.setSlots([
                    {
                        pos: new Vector(0, 0),
                        direction:
                            variant === defaultBuildingVariant ? enumDirection.top : enumDirection.bottom,
                    },
                    {
                        pos: new Vector(1, 0),
                        direction: enumDirection.right,
                    },
                ]);

                break;
            }

            default:
                assertAlways(false, "Unknown filter variant: " + variant);
        }
    }
}
