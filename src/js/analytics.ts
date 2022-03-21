import * as $ from 'jquery'

function createAnalytics(): object {
    let count = 0;
    let isDestroyed: boolean = false;
    const listener = (): number => count++;
    $(document).on('click', listener) // addEventListener

    return {
        destroy() {
            $(document).off('click', listener) // removeEventListener
            isDestroyed = true;
        },

        getClicks() {
            if(isDestroyed) {
                return 'Analytics is destroyed'
            }

            return count;
        }
    }
}

window['analytics'] = createAnalytics();