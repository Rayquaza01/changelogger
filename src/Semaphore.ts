/**
 * A semaphore implementation in JS
 *
 * A semaphore object should be assigned to a critical region.
 *
 * When a function would like to access the critical region, it should call `semaphore.getLock()`.
 * If the lock is free, it will obtain the lock in the form of a resolved promise.
 * If the lock is not free, it will be added to a waitlist and be given an unresolved promise,
 * and should wait for the promise to resolve before accessing the critical region.
 *
 * When you are done with a critical region, you should release the lock with `semaphore.releaseLock()`.
 * This will resolve the promise given to the next function on the waitlist, giving it the lock.
 *
 * If you don't release the lock when you're done, the functions on the waitlist will starve!
 *
 * When the last function on the waitlist releases its lock, the lock will be free again.
 */
export class Semaphore {
    private lock = false;
    private waitlist: Record<"resolve" | "reject", () => void>[] = [];

    /**
     * Requests to get the lock.
     * If the lock is available, a resolved promise will be returned.
     * If the lock is not available yet, a pending promise will be returned to
     * be resolved when the lock is available.
     */
    getLock(): Promise<void> {
        if (!this.lock) {
            this.lock = true;
            return Promise.resolve();
        } else {
            return new Promise((resolve, reject) => {
                this.waitlist.push({resolve, reject});
            });
        }
    }

    /**
     * Release the lock and give it to the next item on the waitlist.
     * You should release the lock after finishing with the critical region
     * to avoid starving the items on the waitlist.
     */
    releaseLock(): void {
        if (this.lock) {
            if (this.waitlist.length === 0) {
                this.lock = false;
                return;
            }

            this.waitlist.shift()?.resolve();
        }
    }
}
